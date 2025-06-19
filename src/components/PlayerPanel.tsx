import React from 'react'
import { Player } from '../game/Player'
import Fort from './Fort'
import Building from './Building'
import Ship from './Ship'

interface PlayerPanelProps {
  player: Player
  onMoveColonist: () => void
  onDestroyFort: (fortIndex: number) => void
  color?: string
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  onMoveColonist,
  onDestroyFort,
  color,
}) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 16,
        minWidth: 320,
      }}>
      <h2 style={{ color }}>{player.name}</h2>
      <p>ID: {player.id}</p>
      <p>Colonists: {player.colonists}</p>
      <p>Coins: {player.coins}</p>
      <p>Attack Dice: {player.attack_dice}</p>
      <p>Rerolls: {player.rerolls}</p>
      <p>
        Cubes:
        <ul>
          <li>Black: {player.shells.black}</li>
          <li>Gray: {player.shells.gray}</li>
          <li>White: {player.shells.white}</li>
        </ul>
      </p>
      <button onClick={onMoveColonist}>Move Colonist</button>
      <div style={{ marginTop: 16 }}>
        <h3>Forts</h3>
        {player.forts.length === 0 ? (
          <p>None</p>
        ) : (
          player.forts.map((fort, i) => (
            <div key={fort.id}>
              <Fort fort={fort} />
              <button onClick={() => onDestroyFort(i)}>Destroy Fort</button>
            </div>
          ))
        )}
        <h3>Buildings</h3>
        {player.buildings.length === 0 ? (
          <p>None</p>
        ) : (
          player.buildings.map(building => (
            <Building key={building.id} building={building} />
          ))
        )}
        <h3>Ships</h3>
        {player.ships.length === 0 ? (
          <p>None</p>
        ) : (
          player.ships.map(ship => <Ship key={ship.id} ship={ship} />)
        )}
      </div>
    </div>
  )
}

export default PlayerPanel
