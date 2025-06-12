import type { FortGridCell } from '../lib/FortGrid'
import { CubeColors } from '../lib/colors'

function getCellLabel(cell: FortGridCell, row: number, col: number) {
  if (cell.type === 'cube' && cell.color) return cell.color[0].toUpperCase()
  return ''
}

export const FortGrid: React.FC<{
  grid: FortGridCell[][]
  view: 'hand' | 'tableau'
  showLabels?: boolean
}> = ({ grid, view, showLabels }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <div
        style={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: `repeat(${grid[0].length}, 24px)`,
        }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let bgColor = '#99bed8'
            let border = '3px solid #925b24'
            if (cell.type === 'cube') {
              if (view === 'hand') {
                bgColor = cell.color ? CubeColors[cell.color] : '#f5f5f5'
              } else if (view === 'tableau') {
                bgColor = cell.color ? CubeColors[cell.color] : '#fff'
              }
            } else {
              border = '3px solid #fff'
            }
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: bgColor,
                  border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: '#222',
                }}
                title={`${rowIndex},${colIndex}`}>
                {showLabels ? getCellLabel(cell, rowIndex, colIndex) : null}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

export default FortGrid
