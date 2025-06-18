import { Die, DieValue } from './Die'

export function rollDice(count: number): DieValue[] {
  return Array.from({ length: count }, () => new Die().value)
}

export function rerollDice(dice: DieValue[], indices: number[]): DieValue[] {
  return dice.map((val, idx) => (indices.includes(idx) ? new Die().value : val))
}

export function rollSingleDie(): DieValue {
  return new Die().value
}

export type rollCounts = Partial<Record<DieValue, number>>

export function reduceDice(roll: DieValue[]): rollCounts {
  return roll.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as rollCounts)
}
