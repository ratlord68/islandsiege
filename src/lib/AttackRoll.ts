import { Die, DieValue } from "./Dice";

export class AttackRoll {
  private dice: Die[];
  private rollCount: number = 0;

  constructor(
    private numDice: number,
    private rerollsRemaining: number,
  ) {
    this.roll_all();
    this.rollCount++;
  }

  private roll_all(): void {
    this.dice = Array.from({ length: this.numDice }, () => new Die());
  }

  reroll(indices?: number[]): void {
    if (this.rerollsRemaining <= 0) {
      throw new Error("No rerolls remain.");
    }

    if (!indices) {
      this.roll_all();
    } else {
      for (const index of indices) {
        if (index < 0 || index >= this.dice.length) {
          throw new Error(`Invalid index ${index} used`);
        }
        this.dice[index].roll(); // reroll individual die
      }
    }

    this.rerollsRemaining--;
    this.rollCount++;
  }

  getRolled(): DieValue[] {
    return this.dice.map((d) => d.value);
  }

  getRerollsRemaining(): number {
    return this.rerollsRemaining;
  }

  decreaseRerollsRemaining() {
    this.rerollsRemaining--;
  }

  finishRoll(): void {
    this.rerollsRemaining = 0;
  }
}
