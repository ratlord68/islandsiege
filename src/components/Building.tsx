import React from 'react'
import { Building as BuildingModel } from '../game/Building'

interface BuildingProps {
  building: BuildingModel
}

const Building: React.FC<BuildingProps> = ({ building }) => (
  <div
    style={{
      border: '1px solid #aaa',
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
    }}>
    <strong>{building.name}</strong>
    <div>Description: {building.description}</div>
    <div>Coins: {building.coins}</div>
    <div>Colonists: {building.colonists}</div>
    <div>Repair Color: {building.repairColor}</div>
  </div>
)

export default Building
