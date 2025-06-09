import type { CubeColor } from '../types';

export type FortGridCell =
  | { type: 'cube'; color: CubeColor | null }
  | { type: 'NaC' };

export type FortGridSpec = [number, number, string][];
export const FORT_GRID_SIZE = 4;

function cubeSymbolToColor(symbol: string): CubeColor {
  switch (symbol) {
    case 'B':
      return 'black';
    case 'W':
      return 'white';
    case 'G':
      return 'gray';
    default:
      throw new Error(`Unknown cube symbol: ${symbol}`);
  }
}

export class FortGrid {
  readonly size: number = FORT_GRID_SIZE;
  private grid: FortGridCell[][];

  constructor(gridSpec: FortGridSpec) {
    this.grid = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({ type: 'NaC' })),
    );

    for (const [row, col, val] of gridSpec) {
      if (row >= this.size || col >= this.size) {
        throw new Error(`Invalid grid position: (${row}, ${col})`);
      }

      this.grid[row][col] = {
        type: 'cube',
        color: val === '.' ? null : cubeSymbolToColor(val),
      };
    }
  }

  get cells(): FortGridCell[][] {
    return this.grid;
  }

  getCell(row: number, col: number): FortGridCell | undefined {
    return this.grid[row]?.[col];
  }

  isFrontBlocked(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const cell = this.grid[r][col];
      if (cell.type === 'cube' && cell.color !== null) return true;
    }
    return false;
  }

  getAdjacentMatchingColor(row: number, col: number): CubeColor[] {
    const cell = this.grid[row]?.[col];
    if (cell?.type !== 'cube' || cell.color == null) return [];

    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const matching: CubeColor[] = [];

    for (const [dr, dc] of dirs) {
      const neighbor = this.grid[row + dr]?.[col + dc];
      if (neighbor?.type === 'cube' && neighbor.color === cell.color) {
        matching.push(neighbor.color);
      }
    }

    return matching;
  }

  // useful for visualizing while debugging
  // components should replace once implemented
  //  B . ~ ~
  //  ~ G ~ ~
  //  ~ ~ W ~
  //  ~ ~ ~ ~
  toString(): string {
    return this.grid
      .map((row) =>
        row
          .map((cell) => {
            if (cell.type === 'NaC') return '~';
            if (cell.color === null) return '.';
            switch (cell.color) {
              case 'gray':
                return 'G';
              case 'black':
                return 'B';
              case 'white':
                return 'W';
            }
          })
          .join(' '),
      )
      .join('\n');
  }

  static fromString(gridText: string): FortGrid {
    const lines = gridText.trim().split('\n');
    const spec: FortGridSpec = [];

    lines.forEach((line, row) => {
      const symbols = line.trim().split(/\s+/);
      symbols.forEach((char, col) => {
        switch (char) {
          case '~':
            break;
          case '.':
            spec.push([row, col, '.']);
            break;
          case 'G':
          case 'B':
          case 'W':
            spec.push([row, col, char]);
            break;
          default:
            throw new Error(`Unknown character '${char}' at (${row}, ${col})`);
        }
      });
    });

    return new FortGrid(spec);
  }
}
