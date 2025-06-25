import { GameState } from 'game/GameState'

export function handleColonize(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex]
  player.populateForts()
  return { ...state, phase: 'action' }
}
