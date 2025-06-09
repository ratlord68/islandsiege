import type { FortGridSpec } from "../FortGrid";
import { createFortGrid } from "../FortGrid";

describe("createFortGrid", () => {
  it("creates grid", () => {
    const spec: FortGridSpec = [
      [0, 0, "G"],
      [0, 1, "B"],
      [1, 2, "W"],
      [2, 3, "."],
    ];
    const expected = [
      [0, 0, "gray"],
      [0, 1, "black"],
      [1, 2, "white"],
      [2, 3, null],
    ] as const;
    const grid = createFortGrid(spec);
    for (const [row, col, color] of expected) {
      const cell = grid[row][col];
      expect(cell.type).toBe("cube");
      if (cell.type === "cube") {
        expect(cell.color).toBe(color);
      }
    }
    const unusable = grid[0][2];
    expect(unusable.type).toBe("NaC");
  });
  it("throws on invalid position", () => {
    const badSpec: FortGridSpec = [[4, 4, "B"]]; // valid indexes are [0-3, 0-3]
    expect(() => createFortGrid(badSpec)).toThrow("Invalid grid position");
  });

  it("throws on unknown symbol", () => {
    const badSpec: FortGridSpec = [[0, 0, "X"]];
    expect(() => createFortGrid(badSpec)).toThrow("Unknown cube symbol: X");
  });
});
