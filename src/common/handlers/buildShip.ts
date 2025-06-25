import { GameState } from 'game/GameState'
import { ShipRegistry } from 'game/ships'

export function handleBuildShip(
  state: GameState,
  payload: { fortID: string; shipID: string },
): GameState {
  const player = state.players[state.currentPlayerIndex]
  const shipToBuild = ShipRegistry[payload.shipID as keyof typeof ShipRegistry]
  const ship = new shipToBuild()
  player.addShip(ship, payload.fortID)
  return { ...state, phase: 'endTurn' }
}
