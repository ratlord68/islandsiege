import { GameState } from 'game/GameState'

export function handleAttackStart(
  state: GameState,
  payload: { targetPlayerIndex: number; fortID: string },
): GameState {
  state.shipLocations[state.currentPlayerIndex] = {}
  const openWaterAttack = !state.players.some(p => p.forts.length >= 1)
  state.attackIsOpenWater = openWaterAttack

  if (openWaterAttack) {
    return { ...state, phase: 'attackRoll' }
  }

  const alreadyTargeted = Object.values(state.shipLocations).some(
    loc => loc.targetPlayerIndex === payload.targetPlayerIndex,
  )
  if (alreadyTargeted)
    throw new Error(`${payload.targetPlayerIndex} cannot be attacked.`)

  state.shipLocations[state.currentPlayerIndex] = {
    targetPlayerIndex: payload.targetPlayerIndex,
    fortID: payload.fortID,
  }

  return { ...state, phase: 'attackRoll' }
}
