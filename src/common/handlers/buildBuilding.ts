import { GameState } from 'game/GameState'
import { BuildingRegistry } from 'game/buildings'

export function handleBuildBuilding(
  state: GameState,
  payload: { fortID: string; buildingID: string },
): GameState {
  const player = state.players[state.currentPlayerIndex]
  const buildingToBuild =
    BuildingRegistry[payload.buildingID as keyof typeof BuildingRegistry]
  const building = new buildingToBuild()
  const fort = player.findFort(payload.fortID)
  fort.addBuilding(building)
  return { ...state, phase: 'endTurn' }
}
