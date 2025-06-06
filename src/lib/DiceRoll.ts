type DieFace = "W" | "B" | "G" | "L" | "S";

// TODO: Add seed to make deterministic
export class DiceRoll {
  private static faces: DieFace[] = ["W", "B", "G", "G", "L", "S"];
  private dice: DieFace[];

  constructor(count: number) {
    this.dice = Array.from({ length: count }, () => DiceRoll.randomFace());
  }

  static randomFace(): DieFace {
    const i = Math.floor(Math.random() * DiceRoll.faces.length);
    return DiceRoll.faces[i];
  }

  getDice(): DieFace[] {
    return [...this.dice]; // return a copy to prevent mutation
  }

  reroll(indices: number[]) {
    for (const index of indices) {
      if (index >= 0 && index < this.dice.length) {
        this.dice[index] = DiceRoll.randomFace();
      }
    }
  }
}
