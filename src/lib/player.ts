import {Player, CubeReserve} from '../types'

export function createPlayer(
    name: string,
    idx: number,
    overrides: Partial<Player> = {}
): Player {
    const defaultCubes: CubeReserve = { black: 0, gray: 0, white: 0 };

    return {
        id: `p${idx}`,
        name,
        coins: 0,
        hand: [],
        buildings: [],
        forts: [],
        ships: [],
        colonists: 9,
        attack_dice: 2,
        rerolls: 1,
        ...overrides,
        cubes: {
            ...defaultCubes,
            ...(overrides.cubes || {}),
        },
    }
}
