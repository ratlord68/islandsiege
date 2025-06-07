
// White, Black, Gray, Leadership, Red
export type DieValue = "W" | "B" | "G" | "L" | "R";

export class Die {
  public static faces: DieValue[] = ["W", "B", "G", "G", "L", "R"];
  public value: DieValue;
  private countRolled: number = 0;

  constructor() {
    this.roll();
  }

  roll(): void {
    const i = Math.floor(Math.random() * Die.faces.length);
    this.countRolled++;
    this.value = Die.faces[i];
  }

  getRolls(): number {
    return this.countRolled;
  }
}