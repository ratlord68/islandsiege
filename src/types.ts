import type { Player } from 'lib/Player'
import type { Deck } from 'lib/Deck'
import type { CubeColor } from 'lib/colors'
import type { Phase } from 'common/phases'

export type Game = {
  id: string
  state: GameState
}

export type GameState = {
  players: Player[]
  currentPlayerIndex: number

  // ordered bottom -> top
  deck: Deck
  phase: Phase
  generalCubeReserve: CubeReserve
}

export type CubeReserve = Record<CubeColor, number>
