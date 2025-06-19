import type { GameState } from '../game/GameState'
import { FortRegistry } from 'game/forts'
import { Building } from '../game/Building'
import { Ship } from '../game/Ship'
import { Player } from '../game/Player'
import { GamePhases, Phase } from './phases'
import { rollDice, rollSingleDie, reduceDice } from '../game/AttackRoll'
import { symbolToColor } from './colors'
import { DieValue } from 'game/Die'

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

        let discarded = player.removeCardInHand(cardID as string)
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
      return {
        ...state,
        phase: 'discard',
      }
    }

    case GamePhases.discard: {
      const { targetPlayerIndex, cardID } = phase.payload

      const player = state.players[state.currentPlayerIndex]
      const removedCard = player.removeCardInHand(cardID as string)
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
      // Fort ID, coordinates / colors to built
      const { fortID, fortGridSpec } = phase.payload
      const player = state.players[state.currentPlayerIndex]
      const ToBuild = FortRegistry[fortID as keyof typeof FortRegistry]
      if (!ToBuild) {
        throw new Error(`Could not find information for $fortID`)
      }
      const fort = new ToBuild()
      player.addFort(fort)

      // Add shells to FortGrid
      const grid = fort.grid
      let shellsBuilt = 0
      // grid.buildSpec(fortGridSpec);
      // TODO: Verify player has adequate shells in supply
      for (const spec of fortGridSpec) {
        const color = symbolToColor(spec[2]) as 'black' | 'white' | 'gray'
        if (
          color &&
          typeof player.shells[color] !== 'undefined' &&
          player.shells[color] > 0
        ) {
          grid.buildSpec([spec])
          player.shells[color]--
          shellsBuilt++
        } else {
          throw new Error(
            `Player does not have enough ${color} in shell supply.`,
          )
        }
      }
      if (fortGridSpec.length !== shellsBuilt) {
        throw new Error(`Could not build all ${fortGridSpec} on ${fort.id}`)
      }
      // TODO: Check if opponents reduce this action
      player.coins += shellsBuilt
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
      // clear previous attack locations
      state.shipLocations[state.currentPlayerIndex] = {}
      const openWaterAttack = !state.players.some(p => p.forts.length >= 1)
      state.attackIsOpenWater = openWaterAttack

      if (openWaterAttack) {
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
      const { action, diceIndicesReroll } = phase.payload

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
      if (action === 'reroll' && state.attackRerollsRemaining > 0) {
        diceIndicesReroll.forEach((idx: number) => {
          state.attackRoll![idx] = rollSingleDie()
        })
        state.attackRerollsRemaining--

        return {
          ...state,
          phase: GamePhases.attackRoll,
        }
      }

      if (action === 'keep' || state.attackRerollsRemaining === 0) {
        // TODO: Add on attack effects to roll
        state.attackValueCounts = reduceDice(state.attackRoll!)
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
      const { attackColor, attackLoc } = phase.payload
      let player = state.players[state.currentPlayerIndex]
      // TODO: Check player / fort abilities
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      let targetFort = targetPlayer.findFort(attackTargets.fortID!)
      const colorKey = attackColor as DieValue
      const diceStrength = state.attackValueCounts[colorKey] ?? 0
      delete state.attackValueCounts[colorKey]
      const grid = targetFort.grid
      grid.attackAt(attackLoc, diceStrength)
      return {
        ...state,
        phase: 'attackReinforceOrWave2',
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
      const newShellReserve = { ...state.shellReserve }
      const newShells = { ...player.shells }
      const allowedSymbols = ['G', 'W', 'B']

      Object.keys(state.attackValueCounts).forEach(symb => {
        if (!allowedSymbols.includes(symb)) return
        const color = symbolToColor(symb)
        const count = state.attackValueCounts[symb as DieValue] ?? 0
        const available = newShellReserve[color] ?? 0

        if (count > 0 && available > 0) {
          const toGive = Math.min(count, available)
          newShells[color] = (newShells[color] ?? 0) + toGive
          newShellReserve[color] = available - toGive
        }
      })
      player.shells = newShells
      return {
        ...state,
        shellReserve: newShellReserve,
        phase: GamePhases.attackDestroy,
      }
    }

    case GamePhases.attackWave2: {
      const { attackLocs } = phase.payload
      const numT = state.attackValueCounts['T'] ?? 0

      if (attackLocs.length !== numT) {
        throw new Error(
          `Invalid number of attack locations: expected ${numT}, got ${attackLocs.length}`,
        )
      }
      const player = state.players[state.currentPlayerIndex]
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      const targetFort = targetPlayer.findFort(attackTargets.fortID!)
      const grid = targetFort.grid
      attackLocs.forEach((loc: [number, number]) => {
        grid.destroyAt(loc)
      })

      return {
        ...state,
        phase: 'attackDestroy',
      }
    }

    case GamePhases.attackDestroy: {
      const attackTargets = state.shipLocations[state.currentPlayerIndex]
      const targetPlayer = state.players[attackTargets.targetPlayerIndex!]
      const targetFort = targetPlayer.findFort(attackTargets.fortID!)
      if (targetFort.shellsRemaining > 0) {
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
        (state.currentPlayerIndex + 1) % state.players.length
      return {
        ...state,
        phase: 'victory',
      }
    }

    default:
      return state
  }
}
