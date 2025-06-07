import { AttackRoll } from "../AttackRoll";
import { Die, DieValue } from "../Dice";

describe("AttackRoll", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct number of dice", () => {
    const roll = new AttackRoll(3, 1);
    const rolled = roll.getRolled();

    expect(rolled).toHaveLength(3);
    rolled.forEach((face) => {
      expect(Die.faces).toContain(face);
    });
  });

  it("should reroll only the specified dice", () => {
    // Spy on Die.prototype.roll and control the value assignment manually
    const values: DieValue[] = ["L", "G", "B", "R"];
    let rolls = 0;

    jest.spyOn(Die.prototype, "roll").mockImplementation(function () {
      this.value = values[rolls++];
    });

    const roll = new AttackRoll(3, 1);
    let rolled = roll.getRolled();
    expect(rolled).toEqual(["L", "G", "B"]);

    roll.reroll([1]);
    rolled = roll.getRolled();
    expect(rolled).toEqual(["L", "R", "B"]); // only index 1 changed
  });

  it("throws error if attempting to reroll past allotted limit", () => {
    const roll = new AttackRoll(2, 1);
    roll.reroll([0]);
    expect(() => roll.reroll([1])).toThrow("No rerolls remain");
  });

  it("throws error if attempting to reroll invalid indices", () => {
    const roll = new AttackRoll(2, 1);
    expect(() => roll.reroll([-1, 2, 999])).toThrow("Invalid index");
  });

  it("getRolled should return a copy, not the original array", () => {
    const roll = new AttackRoll(2, 0);
    const dice = roll.getRolled();
    dice[0] = "X" as DieValue;

    // Internal state should not be affected
    expect(roll.getRolled()).not.toContain("X");
  });
});
