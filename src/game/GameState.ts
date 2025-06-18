import { Player } from './Player'
import { Deck } from './Deck'
import { DieValue } from './Die'
import { Phase } from '../common/phases'
import type { rollCounts } from './AttackRoll'
import { CubeReserve } from './Game'

export type GameState = {
  players: Player[]
  currentPlayerIndex: number
  deck: Deck
  phase: Phase

  pending: {} // wait for all player actions to synchronize
  shipLocations: {
    // Track player protection, once attacked
    [playerIndex: number]: {
      targetPlayerIndex?: number
      fortID?: string
    }
  }
  cubeReserve: CubeReserve
  attackIsOpenWater: boolean
  attackRoll: DieValue[] | undefined
  attackRerollsRemaining: number
  attackValueCounts: rollCounts
  winningPlayerIndex: number | undefined
}
