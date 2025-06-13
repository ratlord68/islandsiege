import { Player } from './Player'
import { Deck } from './Deck'
import { Phase } from 'types'

export type GameState = {
  players: Player[]
  currentPlayer: Player
  deck: Deck
  currentPhase: Phase
  winner: Player | undefined
}
