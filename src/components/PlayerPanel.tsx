import React from 'react'
import { Player } from '../lib/Player'
import Fort from './Fort'
import Building from './Building'
import Ship from './Ship'

interface PlayerPanelProps {
  player: Player
  onMoveColonist: () => void
  onDestroyFort: (fortIndex: number) => void
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  onMoveColonist,
  onDestroyFort,
}) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: 16,
        minWidth: 320,
      }}>
      <h2>{player.name}</h2>
      <p>ID: {player.id}</p>
      <p>Colonists: {player.colonists}</p>
      <p>Coins: {player.coins}</p>
      <p>Attack Dice: {player.attack_dice}</p>
      <p>Rerolls: {player.rerolls}</p>
      <p>
        Cubes:
        <ul>
          <li>Black: {player.cubes.black}</li>
          <li>Gray: {player.cubes.gray}</li>
          <li>White: {player.cubes.white}</li>
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
