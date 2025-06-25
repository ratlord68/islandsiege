import { GameState } from 'game/GameState'

export function handleDraw(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex]
  const drawn = state.deck.draw(3)
  player.addCardsToHand(drawn)
  return { ...state, phase: 'discard' }
}
