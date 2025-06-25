import { GameState } from 'game/GameState'

export function handleEndTurn(state: GameState): GameState {
  const next = (state.currentPlayerIndex + 1) % state.players.length
  return { ...state, currentPlayerIndex: next, phase: 'victory' }
}
