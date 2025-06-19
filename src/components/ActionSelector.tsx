import React from 'react'
import { GamePhases, Phase } from 'common/phases'

interface ActionSelectorProps {
  onSelect: (phase: Phase) => void
}

const ActionSelector: React.FC<ActionSelectorProps> = ({ onSelect }) => (
  <div style={{ margin: '24px 0' }}>
    <h2>Choose your action:</h2>
    <button onClick={() => onSelect(GamePhases.draw)}>Draw</button>
    <button onClick={() => onSelect(GamePhases.buildFort)}>Build Fort</button>
    <button onClick={() => onSelect(GamePhases.buildBuilding)}>
      Build Building
    </button>
    <button onClick={() => onSelect(GamePhases.buildShip)}>Build Ship</button>
    <button onClick={() => onSelect(GamePhases.attackStart)}>Attack</button>
  </div>
)

export default ActionSelector
