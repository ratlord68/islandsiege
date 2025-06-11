import { Player } from '../Player'

describe('createPlayer', () => {
  let p1: Player
  beforeEach(() => {
    p1 = new Player('Jack Sparrow', 1)
  })
  it('creates a player with default values', () => {
    expect(p1.id).toBe('p1')
    expect(p1.name).toBe('Jack Sparrow')
    expect(p1.coins).toBe(0)
    expect(p1.hand).toEqual([])
    expect(p1.buildings).toEqual([])
    expect(p1.forts).toEqual([])
    expect(p1.ships).toEqual([])
    expect(p1.colonists).toBe(9)
    expect(p1.cubes).toEqual({ black: 0, gray: 0, white: 0 })
    expect(p1.attack_dice).toBe(2)
    expect(p1.rerolls).toBe(1)
  })

  it('respects overrides', () => {
    const player = new Player('Blackbeard', 2, {
      coins: 3,
      cubes: { black: 2 },
    })
    expect(player.id).toBe('p2')
    expect(player.coins).toBe(3)
    expect(player.cubes).toEqual({ black: 2, gray: 0, white: 0 })
  })
})
