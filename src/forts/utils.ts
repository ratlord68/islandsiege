import { FortCell, CubeColor } from '../types'

export function parseFortGrid(
  gridSpec: [number, number, string][],
  height: number,
  width: number
): FortCell[][] {
  const grid: FortCell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ type: 'NaC' }))
  );

  for (const [row, col, val] of gridSpec) {
    if (val === ".") {
      grid[row][col] = { type: 'cube', color: null };
    } else {
      const color = cubeSymbolToColor(val);
      grid[row][col] = { type: 'cube', color };
    }
  }

  return grid;
}

function cubeSymbolToColor(symbol: string): CubeColor {
  switch (symbol) {
    case "B": return "black";
    case "W": return "white";
    case "G": return "gray";
    default:
      throw new Error(`Unknown cube symbol: ${symbol}`);
  }
}