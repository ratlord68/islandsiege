import { GameState } from 'game/GameState'
import { DieValue } from 'game/Die'

export function handleAttackWave1(
  state: GameState,
  payload: { attackColor: DieValue; attackLoc: [number, number] },
): GameState {
  const { targetPlayerIndex, fortID } =
    state.shipLocations[state.currentPlayerIndex]!
  const target = state.players[targetPlayerIndex!]
  const targetFort = target.findFort(fortID!)
  const strength = state.attackValueCounts[payload.attackColor] ?? 0
  delete state.attackValueCounts[payload.attackColor]
  targetFort.grid.attackAt(payload.attackLoc, strength)
  return { ...state, phase: 'attackReinforceOrWave2' }
}
