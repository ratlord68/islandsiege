import React from 'react'
import { Ship as ShipModel } from '../lib/Ship'

interface ShipProps {
  ship: ShipModel
}

const Ship: React.FC<ShipProps> = ({ ship }) => (
  <div
    style={{
      border: '1px solid #55a',
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
    }}>
    <strong>{ship.name}</strong>
    <div>Description: {ship.description}</div>
    <div>Coins: {ship.coins}</div>
    <div>Colonists: {ship.colonists}</div>
  </div>
)

export default Ship
