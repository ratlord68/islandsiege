import { GameState } from 'game/GameState'
import { FortRegistry } from 'game/forts'
import { symbolToColor } from 'common/colors'

export function handleBuildFort(
  state: GameState,
  payload: { fortID: string; fortGridSpec: [number, number, string][] },
): GameState {
  const player = state.players[state.currentPlayerIndex]
  const fortToBuild = FortRegistry[payload.fortID as keyof typeof FortRegistry]
  if (!fortToBuild) throw new Error(`Fort not found: ${payload.fortID}`)

  const fort = new fortToBuild()
  player.addFort(fort)
  const grid = fort.grid
  let shellsBuilt = 0

  for (const spec of payload.fortGridSpec) {
    const color = symbolToColor(spec[2]) as 'black' | 'white' | 'gray'
    if ((player.shells[color] ?? 0) > 0) {
      grid.buildSpec([spec])
      player.shells[color] = Math.max(0, (player.shells[color] ?? 0) - 1)
      shellsBuilt++
    } else {
      throw new Error(`Player does not have enough ${color}`)
    }
  }

  if (payload.fortGridSpec.length !== shellsBuilt) {
    throw new Error(`Could not build all components on ${fort.id}`)
  }

  player.coins += shellsBuilt
  return { ...state, phase: 'endTurn' }
}
