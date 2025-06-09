import type { CubeColor } from "../types";

export type FortGridCell =
  | { type: "cube"; color: CubeColor | null }
  | { type: "NaC" }; // Not a Cell, space should remain empty

// sparse representation of the final grid
export type FortGridSpec = [number, number, string][];

// full representation of 4x4 grid
export type FortGrid = FortGridCell[][];
export const FORT_GRID_SIZE = 4;

export function createFortGrid(gridSpec: FortGridSpec): FortGrid {
  const size = 4;
  const grid: FortGrid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ type: "NaC" })),
  );

  for (const [row, col, val] of gridSpec) {
    if (row >= size || col >= size) {
      throw new Error(`Invalid grid position: (${row}, ${col})`);
    }

    grid[row][col] = {
      type: "cube",
      color: val === "." ? null : cubeSymbolToColor(val),
    };
  }

  return grid;
}

function cubeSymbolToColor(symbol: string): CubeColor {
  switch (symbol) {
    case "B":
      return "black";
    case "W":
      return "white";
    case "G":
      return "gray";
    default:
      throw new Error(`Unknown cube symbol: ${symbol}`);
  }
}
