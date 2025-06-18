import { GameState } from 'game/GameState'
import { Deck } from 'game/Deck'
import { Player } from 'game/Player'

export const mockGameState = (
  overrides: Partial<GameState> = {},
): GameState => {
  return {
    players: [new Player('Francis Drake', 1), new Player('Barbarossa', 2)],
    currentPlayerIndex: 0,
    deck: new Deck(),
    phase: 'initGame',
    winningPlayerIndex: undefined,
    pending: {},
    shipLocations: {},
    cubeReserve: { black: 5, white: 5, gray: 5 },
    attackIsOpenWater: false,
    attackRoll: ['B', 'B', 'B'],
    attackRerollsRemaining: 1,
    attackValueCounts: { B: 3, W: 0, G: 0, T: 0, L: 0 },
    ...overrides,
  }
}
