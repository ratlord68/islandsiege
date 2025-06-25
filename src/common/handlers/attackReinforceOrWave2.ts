import { GameState } from 'game/GameState'

export function handleAttackReinforceOrWave2(
  state: GameState,
  payload: { choice: 'reinforce' | 'wave2' },
): GameState {
  const remainingT = state.attackValueCounts['T'] ?? 0
  return {
    ...state,
    phase:
      remainingT === 0 || payload.choice === 'reinforce'
        ? 'attackReinforce'
        : 'attackWave2',
  }
}
