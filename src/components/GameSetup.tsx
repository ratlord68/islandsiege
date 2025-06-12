import React, { useState } from 'react'

interface GameSetupProps {
  onStart: (names: string[]) => void
}

const GameSetup: React.FC<GameSetupProps> = ({ onStart }) => {
  const [names, setNames] = useState(['', ''])

  const handleChange = (idx: number, value: string) => {
    const updated = [...names]
    updated[idx] = value
    setNames(updated)
  }

  const canStart = names.every(n => n.trim().length > 0)

  return (
    <div style={{ padding: 20 }}>
      <h2>Name Your Players</h2>
      {names.map((name, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <label>
            Player {idx + 1}:{' '}
            <input
              value={name}
              onChange={e => handleChange(idx, e.target.value)}
            />
          </label>
        </div>
      ))}
      <button disabled={!canStart} onClick={() => onStart(names)}>
        Start Game
      </button>
    </div>
  )
}

export default GameSetup
