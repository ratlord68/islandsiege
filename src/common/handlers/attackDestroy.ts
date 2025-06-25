import { GameState } from 'game/GameState'

export function handleAttackDestroy(state: GameState): GameState {
  const { targetPlayerIndex, fortID } =
    state.shipLocations[state.currentPlayerIndex]!
  const target = state.players[targetPlayerIndex!]
  const fort = target.findFort(fortID!)

  if (fort.shellsRemaining > 0) {
    return { ...state, phase: 'endTurn' }
  }

  target.destroyFort(fortID!)
  return { ...state, phase: 'endTurn' }
}
