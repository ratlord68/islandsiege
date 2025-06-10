import { BuildingCard, FortCard } from '../Card'
import { CubeColor } from '../colors'

export const mockBuildingCard: BuildingCard = {
  id: 'testBuilding',
  name: 'Test Building',
  type: 'building',
  description: 'Testing',
  cost: 2,
  coins: 3,
  repairColor: 'black' as CubeColor,
}

export const mockFortCard: FortCard = {
  id: 'testFort',
  type: 'fort',
  name: 'Test Fort',
  description: 'Testing',
  gridSpec: [
    [0, 0, 'B'],
    [0, 1, '.'],
    [2, 2, 'W'],
    [3, 3, 'G'],
  ],
  slots: 3,
}
