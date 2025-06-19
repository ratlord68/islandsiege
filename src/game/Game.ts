import { ShellColor } from 'common/colors'
import { GameState } from './GameState'

export type Game = {
  id: string
  state: GameState
}

export type ShellReserve = Partial<Record<ShellColor, number>>
