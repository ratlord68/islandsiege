import { GameState } from 'game/GameState'

export function handleDiscard(
  state: GameState,
  payload: { targetPlayerIndex: number; cardID: string },
): GameState {
  const player = state.players[state.currentPlayerIndex]
  const target = state.players[payload.targetPlayerIndex]
  const removed = player.removeCardInHand(payload.cardID)
  player.drawCache = []
  target.addCardsToHand([removed])
  return { ...state, phase: 'endTurn' }
}
