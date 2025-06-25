import { GameState } from 'game/GameState'

export function handleAttackWave2(
  state: GameState,
  payload: { attackLocs: [number, number][] },
): GameState {
  const numT = state.attackValueCounts['T'] ?? 0
  if (payload.attackLocs.length !== numT) {
    throw new Error(
      `Expected ${numT} locations, got ${payload.attackLocs.length}`,
    )
  }

  const { targetPlayerIndex, fortID } =
    state.shipLocations[state.currentPlayerIndex]!
  const target = state.players[targetPlayerIndex!]
  const targetFort = target.findFort(fortID!)

  payload.attackLocs.forEach(loc => targetFort.grid.destroyAt(loc))

  return { ...state, phase: 'attackDestroy' }
}
