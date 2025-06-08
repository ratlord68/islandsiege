import type { CubeColor } from "../types";

export type FortGridCell =
  | { type: "cube"; color: CubeColor | null }
  | { type: "NaC" }; // Not a Cell, space should remain empty

// sparse representation of the final grid
export type FortGridSpec = [number, number, string][];

// full representation of 4x4 grid
export type FortGrid = FortGridCell[][];
export const FORT_GRID_SIZE = 4;
