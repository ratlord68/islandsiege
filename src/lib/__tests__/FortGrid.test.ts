import { FortGrid } from '../FortGrid';
import type { FortGridSpec } from '../FortGrid';

describe('FortGrid', () => {
  it('creates grid from spec', () => {
    const spec: FortGridSpec = [
      [0, 0, 'G'],
      [0, 1, 'B'],
      [1, 2, 'W'],
      [2, 3, '.'],
    ];
    const expected = [
      [0, 0, 'gray'],
      [0, 1, 'black'],
      [1, 2, 'white'],
      [2, 3, null],
    ] as const;

    const grid = new FortGrid(spec);
    for (const [row, col, color] of expected) {
      const cell = grid.getCell(row, col);
      expect(cell?.type).toBe('cube');
      if (cell?.type === 'cube') {
        expect(cell.color).toBe(color);
      }
    }

    const unusable = grid.getCell(0, 2);
    expect(unusable?.type).toBe('NaC');
  });

  it('throws on invalid grid position', () => {
    const badSpec: FortGridSpec = [[4, 4, 'B']];
    expect(() => new FortGrid(badSpec)).toThrow('Invalid grid position');
  });

  it('throws on unknown symbol', () => {
    const badSpec: FortGridSpec = [[0, 0, 'X']];
    expect(() => new FortGrid(badSpec)).toThrow('Unknown cube symbol: X');
  });

  it('toString and fromString work as expected', () => {
    const spec: FortGridSpec = [
      [0, 0, 'B'],
      [0, 1, '.'],
      [1, 1, 'G'],
      [2, 2, 'W'],
    ];
    const grid = new FortGrid(spec);
    const str = grid.toString();

    expect(str).toMatch(/^B \. ~ ~\n~ G ~ ~\n~ ~ W ~\n~ ~ ~ ~$/);

    const parsedGrid = FortGrid.fromString(str);
    expect(parsedGrid.toString()).toBe(str); // Round-trip consistency
  });

  it('isFrontBlocked detects blocking cubes', () => {
    const spec: FortGridSpec = [
      [0, 0, 'B'],
      [1, 0, 'G'],
    ];
    const grid = new FortGrid(spec);
    expect(grid.isFrontBlocked(1, 0)).toBe(true);
    expect(grid.isFrontBlocked(0, 0)).toBe(false);
  });

  it('getAdjacentMatchingColor returns matching neighbors', () => {
    const spec: FortGridSpec = [
      [1, 1, 'B'],
      [1, 2, 'B'],
      [2, 1, 'B'],
      [0, 1, 'G'],
    ];
    const grid = new FortGrid(spec);
    const matches = grid.getAdjacentMatchingColor(1, 1);
    expect(matches).toEqual(['black', 'black']);
  });
});
