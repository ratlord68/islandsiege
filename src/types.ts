import type { Player } from 'lib/Player'
import type { Deck } from 'lib/Deck'
import type { CubeColor } from 'lib/colors'

export type Phase =
  | 'initGame'
  | 'initDraw'
  | 'victory'
  | 'colonist'
  | 'action'
  | 'draw'
  | 'build'
  | 'attack'
  | 'reroll'
  | 'endTurn'
  | 'gameEnd'

export type Game = {
  id: string
  state: GameState
}

export type GameState = {
  players: Player[]
  currentPlayer: Player

  // ordered bottom -> top
  deck: Deck
  phase: Phase
}

export type CubeReserve = Record<CubeColor, number>
