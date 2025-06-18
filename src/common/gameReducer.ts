import type { GameState } from '../game/GameState'
import { Fort } from '../game/Fort'
import { Building } from '../game/Building'
import { Ship } from '../game/Ship'
import { Player } from '../game/Player'
import { GamePhases, Phase } from './phases'
import { rollDice, rollSingleDie, reduceDice } from '../game/AttackRoll'

export function gameReducer(
  state: GameState,
  phase: { type: Phase; payload?: any },
): GameState {
  switch (phase.type) {
    case GamePhases.initGame:
      return {
        ...state,
        players: phase.payload.playerNames.map(
          (name: string, idx: number) => new Player(name, idx + 1),
        ),
        phase: 'initDraw',
      }

    case GamePhases.initDraw: {
      const cardsToDraw = 3
      const deck = state.deck
      const players = state.players

      players.forEach(player => {
        const drawn = deck.draw(cardsToDraw)
        player.addCardsToHand(drawn)
      })
      state.players = players
      state.deck = deck

      return {
        ...state,
        phase: 'initDiscard',
      }
    }

    case GamePhases.initDiscard: {
      const { playerIdx, cardID } = phase.payload
      const pending = { ...state.pending, [playerIdx]: cardID }

      if (Object.keys(pending).length < state.players.length) {
        // not all players have selected a discard
        return { ...state, pending }
      }

      Object.entries(pending).forEach(([idxStr, cardID]) => {
        const idx = parseInt(idxStr, 10)
        const nextIdx = (idx + 1) % state.players.length
        const player = state.players[idx]
        const targetPlayer = state.players[nextIdx]

        let discarded = player.removeCardInHand(cardID)
        targetPlayer.hand.push(discarded)
        player.drawCache = [] // reset for UI
        state.players[idx] = player
        state.players[nextIdx] = targetPlayer
      })
      return {
        ...state,
        pending: {},
        phase: 'action',
      }
    }

    case GamePhases.draw: {
      const cardsToDraw = 3
      const player = state.players[state.currentPlayerIndex]
      const drawn = state.deck.draw(cardsToDraw)
      // TODO: Add some logging
      player.addCardsToHand(drawn)
      // not sure if this is required...
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'discard',
      }
    }

    case GamePhases.discard: {
      const { targetPlayerIndex, cardID } = phase.payload

      const player = state.players[state.currentPlayerIndex]
      const removedCard = player.removeCardInHand(cardID)
      player.drawCache = []
      // TODO: Handle case where card is not given
      const target = state.players[targetPlayerIndex]
      target.addCardsToHand([removedCard])

      state.players[state.currentPlayerIndex] = player
      state.players[targetPlayerIndex] = target
      return {
        ...state,
        phase: 'endTurn',
      }
    }

    case GamePhases.victory: {
      const player = state.players[state.currentPlayerIndex]
      if (player.colonists <= 0) {
        state.winningPlayerIndex = state.currentPlayerIndex
        return {
          ...state,
          phase: 'gameOver',
        }
      }
      if (player.coins >= 20) {
        const opponentWithMore = state.players.some(
          (opp, idx) =>
            idx !== state.currentPlayerIndex && opp.coins >= player.coins,
        )
        if (!opponentWithMore) {
          state.winningPlayerIndex = state.currentPlayerIndex
          return {
            ...state,
            phase: 'gameOver',
          }
        }
      }
      return {
        ...state,
        phase: 'colonize',
      }
    }

    case GamePhases.colonize: {
      const player = state.players[state.currentPlayerIndex]
      player.populateForts()
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'action',
      }
    }

    case GamePhases.action: {
      const { actionChosen } = phase.payload
      state.shipLocations[state.currentPlayerIndex] = {}
      switch (actionChosen) {
        // TODO: Verify action is valid for player prior to returning
        case 'draw':
          // TODO: Check if any opponents block this action
          return { ...state, phase: GamePhases.draw }
        case 'buildFort':
          return { ...state, phase: GamePhases.buildFort }
        case 'buildBuilding':
          // TODO: Check if any opponents block this action
          return { ...state, phase: GamePhases.buildBuilding }
        case 'buildShip':
          // TODO: Check if any opponents block this action
          return { ...state, phase: GamePhases.buildShip }
        case 'attack':
          return { ...state, phase: GamePhases.attackStart }
        default:
          throw new Error(`Invalid action ${actionChosen}`)
      }
    }

    case GamePhases.buildFort: {
      const { fortCard } = phase.payload
      const player = state.players[state.currentPlayerIndex]

      const fort = new Fort(fortCard)
      player.addFort(fort)
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'addFortCubes',
      }
    }

    case GamePhases.addFortCubes: {
      const { fortID, fortGridSpec } = phase.payload

      const player = state.players[state.currentPlayerIndex]
      const fort = player.findFort(fortID)
      // Need to verify this is properly propagated
      // Otherwise, add buildSpec method to Fort class
      const grid = fort.grid
      const cubesBuilt = grid.buildSpec(fortGridSpec)
      if (fortGridSpec.length > cubesBuilt) {
        // sanity check for not all requested builds completing
        throw new Error(`Could not build all ${fortGridSpec} on ${fort.id}`)
      }
      // TODO: Check if opponents reduce this action
      player.coins += cubesBuilt
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'endTurn',
      }
    }

    case GamePhases.buildBuilding: {
      const { fortID, buildingCard } = phase.payload
      const player = state.players[state.currentPlayerIndex]

      const building = new Building(buildingCard)
      const fort = player.findFort(fortID)
      fort.addBuilding(building) // not sure this gets propagated to player
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'endTurn',
      }
    }

    case GamePhases.buildBuilding: {
      const { fortID, shipCard } = phase.payload
      const player = state.players[state.currentPlayerIndex]

      const ship = new Ship(shipCard)
      player.addShip(ship, fortID)
      state.players[state.currentPlayerIndex] = player
      return {
        ...state,
        phase: 'endTurn',
      }
    }

    case GamePhases.attackStart: {
      const { targetPlayerIndex, fortID } = phase.payload
      const openWaterAttack = !state.players.some(p => p.forts.length >= 1)

      if (openWaterAttack) {
        state.attackIsOpenWater = true
        return { ...state, phase: 'attackRoll' }
      }
      const targetNotAvailable = Object.values(state.shipLocations).some(
        loc => loc.targetPlayerIndex === targetPlayerIndex,
      )
      if (targetNotAvailable) {
        throw new Error(`${targetPlayerIndex} cannot be attacked.`)
      }
      // track which player and fort is attacked
      state.shipLocations[state.currentPlayerIndex] = {
        targetPlayerIndex: targetPlayerIndex,
        fortID: fortID,
      }
      return {
        ...state,
        phase: 'attackRoll',
      }
    }

    case GamePhases.attackRoll: {
      // possible actions: init, reroll, keep
      const { action, diceToReroll } = phase.payload

      let player = state.players[state.currentPlayerIndex]
      if (action === 'init') {
        let dice = player.attack_dice
        // TODO: Account for opponent effects
        state.attackRoll = rollDice(dice)
        state.attackRerollsRemaining = player.rerolls
        return {
          ...state,
          phase: 'attackRoll',
        }
      }
      let rerollsLeft = state.attackRerollsRemaining
      if (action === 'reroll' && rerollsLeft > 0) {
        // Reroll selected dice
        const reroll = state.attackRoll.map((val, idx) =>
          diceToReroll.includes(idx) ? rollSingleDie() : val,
        )

        return {
          ...state,
          attackRoll: reroll,
          attackRerollsRemaining: rerollsLeft--,
          phase: GamePhases.attackRoll,
        }
      }

      if (action === 'keep' || rerollsLeft === 0) {
        // TODO: Add on attack effects to roll
        state.attackValueCounts = reduceDice(state.attackRoll)
        return {
          ...state,
          phase: GamePhases.attackLeadership,
        }
      }
      return state
    }

    case GamePhases.attackLeadership: {
      let player = state.players[state.currentPlayerIndex]
      // TODO: Add player & fort effects
      if (state.attackIsOpenWater) {
        return {
          ...state,
          phase: 'attackReinforce',
        }
      }
      return {
        ...state,
        phase: 'attackWave1',
      }
    }

    case GamePhases.attackWave1: {
      // UI should give valid targets
      const { attackColor, attackRow, attackCol } = phase.payload
      let player = state.players[state.currentPlayerIndex]
      // TODO: Check player / fort abilities
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      let targetFort = targetPlayer.findFort(attackTargets.fortID!)
      const diceStrength = state.attackRollCounts[attackColor]
      delete state.attackValueCounts[attackColor] // remove from next rolls
      const grid = targetFort.grid
      grid.destroyAt(attackRow, attackCol)
      // TODO: Ensure change is preserved

      return {
        ...state,
        phase: 'attackWave2',
      }
    }

    case GamePhases.attackReinforceOrWave2: {
      const { choice } = phase.payload
      const valueCounts = state.attackValueCounts
      if ((valueCounts['T'] ?? 0) === 0 || choice === 'reinforce') {
        return {
          ...state,
          phase: 'attackReinforce',
        }
      }
      return {
        ...state,
        phase: 'attackWave2',
      }
    }

    case GamePhases.attackReinforce: {
      const player = state.players[state.currentPlayerIndex]
      const values = state.attackValueCounts
      state.cubeReserve // cubes are a finitxe resource
      const cubeColors = ['gray', 'black', 'white']
      cubeColors.forEach(color => {
        const toMove = Math.min(values[color], state.cubeReserve[color])
        state.cubeReserve[color] -= toMove
        player.updateCubes(toMove)
        state.players[state.currentPlayerIndex] = player
      })

      return {
        ...state,
        phase: 'attackDestroy',
      }
    }

    case GamePhases.attackWave2: {
      const { gridLocs } = phase.payload
      const numT = state.cubeReserve['T'] ?? 0

      const player = state.players[state.currentPlayerIndex]
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      const targetFort = targetPlayer.findFort(attackTargets.fortID!)

      return {
        ...state,
        phase: 'attackDestroy',
      }
    }

    case GamePhases.attackDestroy: {
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      const targetFort = targetPlayer.findFort(attackTargets.fortID!)
      if (targetFort.hasShells()) {
        return {
          ...state,
          phase: 'endTurn',
        }
      }
      // Destroys forts + buildings
      // Returns colonists to Player
      targetPlayer.destroyFort(attackTargets.fortID!)
      state.players[attackTargets.targetPlayerIndex!] = targetPlayer
      return {
        ...state,
        phase: 'endTurn',
      }
    }

    case GamePhases.endTurn: {
      state.currentPlayerIndex =
        state.currentPlayerIndex++ % state.players.length
      return {
        ...state,
        phase: 'victory',
      }
    }

    default:
      return state
  }
}
