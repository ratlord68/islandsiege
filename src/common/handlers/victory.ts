import { GameState } from 'game/GameState'

export function handleVictory(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex]

  if (
    player.colonists <= 0 ||
    (player.coins >= 20 &&
      !state.players.some(
        (p, i) => i !== state.currentPlayerIndex && p.coins >= player.coins,
      ))
  ) {
    return {
      ...state,
      phase: 'gameOver',
      winningPlayerIndex: state.currentPlayerIndex,
    }
  }

  return { ...state, phase: 'colonize' }
}
