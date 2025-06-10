export type Player = {
  id: string
  name: string
  coins: number
  hand: Card[]
  buildings: Building[]
  forts: Fort[]
  ships: Ship[]
  colonists: number // remaining colonists on player board
  cubes: CubeReserve // personal cube supply

  // TODO: extra actions unlocked with colonists?
  attack_dice: number
  rerolls: number
}

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
  deck: Card[]
  discardPile: Card[]
  phase: Phase
}

// Establish one for each player, and one general
export type CubeReserve = {
  black?: number
  white?: number
  gray?: number
}
