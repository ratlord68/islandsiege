import { rollDice, rollSingleDie, reduceDice } from 'game/AttackRoll'
import { GameState } from 'game/GameState'

export function handleAttackRoll(
  state: GameState,
  payload: { action: 'init' | 'reroll' | 'keep'; diceIndicesReroll?: number[] },
): GameState {
  const player = state.players[state.currentPlayerIndex]

  if (payload.action === 'init') {
    state.attackRoll = rollDice(player.attack_dice)
    state.attackRerollsRemaining = player.rerolls
    return { ...state, phase: 'attackRoll' }
  }

  if (payload.action === 'reroll' && state.attackRerollsRemaining > 0) {
    payload.diceIndicesReroll?.forEach(idx => {
      state.attackRoll![idx] = rollSingleDie()
    })
    state.attackRerollsRemaining--
    return { ...state, phase: 'attackRoll' }
  }

  if (payload.action === 'keep' || state.attackRerollsRemaining === 0) {
    state.attackValueCounts = reduceDice(state.attackRoll!)
    return { ...state, phase: 'attackLeadership' }
  }

  return state
}
