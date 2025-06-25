import { GameState } from 'game/GameState'

export function handleAttackLeadership(state: GameState): GameState {
  // TODO: Add leadership use logic
  return {
    ...state,
    phase: state.attackIsOpenWater ? 'attackReinforce' : 'attackWave1',
  }
}
