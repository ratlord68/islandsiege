import { Fort } from '../Fort'
import type { FortGridCube } from '../FortGrid'
import type { FortCard } from '../Card'
import { Building } from '../Building'

// Mock building class for controlled testing
class MockBuilding extends Building {
  constructor(public colonists: number = 0) {
    super()
  }

  applyRepair(): boolean {
    this.repaired = true
    return true
  }
}

const mockFortCard: FortCard = {
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

describe('Fort', () => {
  let fort: Fort

  beforeEach(() => {
    fort = new Fort({
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
    })
  })

  it('initializes correctly', () => {
    expect(fort.id).toBe('testFort')
    expect(fort.type).toBe('fort')
    expect(fort.name).toBe('Test Fort')
    expect(fort.description).toBe('Testing')
    expect(fort.grid.cubeInfo).toHaveLength(4)
    let loc = fort.grid.cellAt(0, 0)
    expect(loc.type).toBe('cube')
    expect((loc as FortGridCube).color).toBe('black')
    expect(fort.slots).toBe(3)
    expect(fort.openSlots).toBe(3)
    expect(fort.usedSlots).toBe(0)
    expect(fort.buildings).toHaveLength(0)
  })

  it('builds on empty cells', () => {
    let cell = fort.grid.cellAt(0, 1)
    expect((cell as FortGridCube).color).toBeNull()
    fort.grid.buildSpec([[0, 1, 'B']])
    cell = fort.grid.cellAt(0, 1)
    expect((cell as FortGridCube).color).toBe('black')
  })
  it('places and removes colonists correctly', () => {
    expect(fort.placeColonist()).toBe(true)
    expect(fort.usedSlots).toBe(1)
    expect(fort.openSlots).toBe(2)

    expect(fort.removeColonist()).toBe(true)
    expect(fort.usedSlots).toBe(0)
    expect(fort.openSlots).toBe(3)
  })

  it('does not place colonists beyond slot limit', () => {
    expect(fort.placeColonist()).toBe(true)
    expect(fort.placeColonist()).toBe(true)
    expect(fort.placeColonist()).toBe(true)
    expect(fort.usedSlots).toBe(3)
    expect(fort.placeColonist()).toBe(false)
    expect(fort.usedSlots).toBe(3)
    expect(fort.openSlots).toBe(0)
  })

  //   it("adds and repairs building", () => {
  //     const fort = new Fort(mockFortCard);
  //     const building = new MockBuilding(2);

  //     fort.addBuilding(building);

  //     expect(fort.buildings).toContain(building);
  //     expect(building.fort).toBe(fort);
  //     expect(building.repaired).toBe(true);
  //   });

  it('colonists includes building and fort slots', () => {
    fort.placeColonist() // +1
    const b1 = new MockBuilding(2) // +2
    const b2 = new MockBuilding(1) // +1
    fort.addBuilding(b1)
    fort.addBuilding(b2)

    expect(fort.colonists).toBe(4)
  })
})
