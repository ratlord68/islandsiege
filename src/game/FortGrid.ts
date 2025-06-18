import { ShellColor, symbolToColor, colorToSymbol } from '../common/colors'

export type FortGridNaC = { type: 'NaC' }
export type FortGridShell = { type: 'shell'; color: ShellColor | null }
export type FortGridCell = FortGridShell | FortGridNaC

export type FortGridSpec = [number, number, string][]
export const FORT_GRID_SIZE = 4

type ShellInfo = {
  loc: [number, number]
  color: ShellColor | null
  protectBonus: boolean
  connectStrength: number
}

export class FortGrid {
  readonly size: number = FORT_GRID_SIZE
  private grid: FortGridCell[][]
  private shellInfoCache: ShellInfo[] = []
  shellsRemaining: number = 0

  constructor(gridSpec: FortGridSpec) {
    this.grid = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({ type: 'NaC' })),
    )

    for (const [row, col, val] of gridSpec) {
      if (row >= this.size || col >= this.size) {
        throw new Error(`Invalid grid position: (${row}, ${col})`)
      }

      const color = val === '.' ? null : symbolToColor(val)
      this.grid[row][col] = {
        type: 'shell',
        color,
      }

      this.shellInfoCache.push({
        loc: [row, col],
        // the following properties may be changed throughout
        color: color,
        protectBonus: false,
        connectStrength: 0,
      })
    }
    this.updateShellInfo()
  }

  get allCells(): FortGridCell[][] {
    return this.grid
  }

  get shellInfo(): ShellInfo[] {
    return this.shellInfoCache
  }

  shellInfoAt(loc: [number, number]): ShellInfo {
    const [row, col] = loc
    const info = this.shellInfoCache.find(
      s => s.loc[0] === row && s.loc[1] === col,
    )
    if (!info) {
      throw new Error(`No shell info found at (${loc}): ${this.shellInfoCache}`)
    }
    return info
  }

  cellAt(loc: [number, number]): FortGridCell {
    const [r, c] = loc
    return this.grid[r]?.[c]
  }

  private updateShellInfo(): void {
    let shellCount = 0
    for (const info of this.shellInfoCache) {
      const loc = info.loc
      const cell = this.grid[loc[0]][loc[1]]

      if (cell.type !== 'shell') continue
      if (cell.color) {
        shellCount++
      }
      info.color = cell.color ?? null
      info.protectBonus = this.cellAtIsProtected(loc)
      info.connectStrength = this.cellAtConnectedStrength(loc)
    }
    this.shellsRemaining = shellCount
  }

  cellAtIsProtected(loc: [number, number]): boolean {
    const [row, col] = loc
    for (let r = 0; r < row; r++) {
      const cell = this.grid[r][col]
      if (cell.type === 'shell' && cell.color !== null) return true
    }
    return false
  }

  cellAtConnectedStrength(loc: [number, number]): number {
    return this.traverseConnectedShells(loc).length
  }

  buildSpec(specs: FortGridSpec): number {
    let builds = 0
    for (const [r, c, symbol] of specs) {
      const cell = this.grid[r][c]
      if (cell.type !== 'shell') continue
      if (cell.color) {
        throw new Error('Attempting to build on non-empty cell.')
      }
      cell.color = symbol === '.' ? null : symbolToColor(symbol)
      builds += 1
    }
    this.updateShellInfo()
    return builds
  }

  attackAt(loc: [number, number], count: number): boolean {
    const info = this.shellInfo.find(i => i.loc === loc)
    if (info && (info.protectBonus || info.connectStrength > count)) {
      return false
    }
    this.destroyAt(loc, true)
    return true
  }

  destroyAt(loc: [number, number], destroyConnected: boolean = false): void {
    if (destroyConnected) {
      this.traverseConnectedShells(loc, (r, c) => {
        const cell = this.grid[r][c]
        if (cell.type === 'shell') {
          cell.color = null
        }
      })
    } else {
      const [r, c] = loc
      const cell = this.grid[r][c]
      if (cell.type === 'shell') {
        cell.color = null
      }
    }
    this.updateShellInfo()
  }

  private traverseConnectedShells(
    loc: [number, number],
    fn?: (r: number, c: number) => void,
  ): [number, number][] {
    const [row, col] = loc
    const start = this.grid[row]?.[col]
    if (!start || start.type !== 'shell' || start.color == null) return []

    const color = start.color
    const visited = new Set<string>()
    const stack = [[row, col]]
    const result: [number, number][] = []

    while (stack.length > 0) {
      const [r, c] = stack.pop()!
      const key = `${r},${c}`
      if (visited.has(key)) continue

      const cell = this.grid[r]?.[c]
      if (!cell || cell.type !== 'shell' || cell.color !== color) continue

      visited.add(key)
      result.push([r, c])

      // optional callback function
      if (fn) fn(r, c)

      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (
          nr >= 0 &&
          nr < this.size &&
          nc >= 0 &&
          nc < this.size &&
          !visited.has(`${nr},${nc}`)
        ) {
          stack.push([nr, nc])
        }
      }
    }

    return result
  }

  // useful for visualizing while debugging
  // components should replace once implemented
  //  B . ~ ~
  //  ~ G ~ ~
  //  ~ ~ W ~
  //  ~ ~ ~ ~
  toString(): string {
    return this.grid
      .map(row =>
        row
          .map(cell => {
            if (cell.type === 'NaC') return '~'
            if (cell.color === null) return '.'
            return colorToSymbol(cell.color)
          })
          .join(' '),
      )
      .join('\n')
  }

  static fromString(gridText: string): FortGrid {
    const lines = gridText.trim().split('\n')
    const spec: FortGridSpec = []

    lines.forEach((line, row) => {
      const symbols = line.trim().split(/\s+/)
      symbols.forEach((char, col) => {
        switch (char) {
          case '~':
            break
          case '.':
            spec.push([row, col, '.'])
            break
          case 'G':
          case 'B':
          case 'W':
            spec.push([row, col, char])
            break
          default:
            throw new Error(`Unknown character '${char}' at (${row}, ${col})`)
        }
      })
    })

    return new FortGrid(spec)
  }
}
