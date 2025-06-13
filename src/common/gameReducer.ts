import type { GameState } from '../types'
import { Player } from '../game/Player'
import { GamePhases, Phase } from './phases'

// type Action =
//   | { type: 'INIT_GAME'; payload: { names: string[] } }
//   | { type: 'COLONIST_PHASE' }
//   | { type: 'ACTION_PHASE' }
//   | { type: 'ATTACK' }
//   | { type: 'NEXT_TURN' }
//   | { type: 'CHECK_WIN' }

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
        phase: 'draw',
      }
    // TODO: Either make separate Phase for initial draw
    // or add some key (requires?) which won't advance until
    // all players submit
    case GamePhases.draw: {
      const updatedPlayers = state.players.map(player => {
        const drawn = state.deck.draw(3)
        return { ...player, hand: [...player.hand, ...drawn] }
      })
      return {
        ...state,
        players: updatedPlayers,
        deck: state.deck,
        phase: 'giveCard',
      }
    }
    // TODO: Same as above
    case GamePhases.giveCard: {
      const { currentPlayerIndex, opponentIdx, cardId } = phase.payload

      const players = [...state.players]
      const player = players[currentPlayerIndex]
      const opponent = players[opponentIdx]

      // TODO: add helper method for finding card by id
      const cardIdx = player.hand.findIndex((c: any) => c.id === cardId)
      const [givenCard] = player.hand.splice(cardIdx, 1) // errors if not present
      opponent.hand = [...opponent.hand, givenCard]
      return {
        ...state,
        players,
        phase: 'action',
      }
    }
    case GamePhases.colonize: {
      const players = [...state.players]
      const player = players[state.currentPlayerIndex]
      let playerColonists = player.colonists

      player.forts = player.forts.map(fort => {
        // Seems like this should be a player method
        if (playerColonists > 0 && fort.openSlots > 0) {
          player.placeColonist(fort)
        }
      })
    }

    case ActionTypes.COLONIST_PHASE: {
      if (currentPlayer.colonists > 0 && availableSlots(currentPlayer.forts)) {
        const updatedPlayer: Player = {
          ...currentPlayer,
          supply: currentPlayer.supply - 1,
          fort: {
            ...currentPlayer.fort,
            placedColonists: currentPlayer.fort.placedColonists + 1,
          },
        }

        const updatedPlayers = [...state.players]
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer

        return {
          ...state,
          players: updatedPlayers,
          phase: 'action',
        }
      }
    }

    case ActionTypes.ACTION_PHASE: {
      // Action - return fleet and take one of the following sub-actions
      //  1. Draw cards - draw 3, keep 2 and give 1 to opponent
      //  2. Build (Fort) - play from hand to tableau, add designed cube from general supply, add other cubes from personal supply (score 1 coin per cube)
      //  3. Build (Building) - play from hand to fort, move colonists from fort to building, repair fort, score coins
      //  4. Build (Ship) - play from hand to tableau, move colonists from (single) fort to ship, score coins
      //  5. Attack - move ship to fort
      return {
        ...state,
        phase: 'attack',
      }
    }

    case ActionTypes.ATTACK: {
      // For now, stub — we'll implement real logic later
      return {
        ...state,
        phase: 'placeColonist',
      }
    }

    case ActionTypes.NEXT_TURN: {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        phase: 'placeColonist',
      }
    }

    case ActionTypes.CHECK_WIN: {
      if (currentPlayer.supply === 0 || currentPlayer.coins >= 20) {
        return {
          ...state,
          winner: currentPlayer.id,
        }
      }
      return state
    }

    default:
      return state
  }
}
