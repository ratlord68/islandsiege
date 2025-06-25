import { GameState } from 'game/GameState'

export function handleInitDistribute(state: GameState): GameState {
  const pending = state.pending || {}

  Object.entries(pending).forEach(([idxStr, cardID]) => {
    const idx = parseInt(idxStr, 10)
    const nextIdx = (idx + 1) % state.players.length
    const player = state.players[idx]
    const target = state.players[nextIdx]
    const discarded = player.removeCardInHand(cardID as string)
    target.hand.push(discarded)
    player.drawCache = []
  })

  return {
    ...state,
    pending: {},
    phase: 'action',
  }
}
