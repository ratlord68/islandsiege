import React from 'react'
import type { FortGridCell } from '../lib/FortGrid'
import { CubeColors } from '../lib/colors'
import { Fort as FortModel } from '../lib/Fort'

interface FortProps {
  fort: FortModel
}

const Fort: React.FC<FortProps> = ({ fort }) => (
  <div
    style={{
      border: '1px solid #888',
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
    }}>
    <strong>{fort.name}</strong>
    <div>Description: {fort.description}</div>
    <div>Slots: {fort.slots}</div>
    <div style={{ margin: '8px 0' }}>
      <FortGrid grid={fort.grid.allCells} view="tableau" showLabels={false} />
    </div>
    <div>Colonists: {fort.colonists}</div>
    {fort.buildings && fort.buildings.length > 0 && (
      <div style={{ marginTop: 8 }}>
        <em>Buildings in Fort:</em>
        <ul>
          {fort.buildings.map(b => (
            <li key={b.id}>{b.name}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

export default Fort

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
            let bgColor = '#0059b3' // sea water
            let border = '1px solid #ccc'
            if (cell.type === 'cube') {
              if (view === 'hand') {
                bgColor = cell.color ? CubeColors[cell.color] : '#f5f5f5'
              } else if (view === 'tableau') {
                bgColor = cell.color ? CubeColors[cell.color] : '#fff'
              }
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
