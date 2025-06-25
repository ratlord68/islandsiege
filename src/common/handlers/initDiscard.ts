import { GameState } from 'game/GameState'

export function handleInitDiscard(
  state: GameState,
  payload: { playerIdx: number; cardID: string },
): GameState {
  const pending = { ...state.pending, [payload.playerIdx]: payload.cardID }

  if (Object.keys(pending).length < state.players.length) {
    return { ...state, phase: 'initDiscard', pending }
  }
  return { ...state, phase: 'initDistribute', pending }
}
