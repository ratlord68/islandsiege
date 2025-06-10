import type { CardType, FortCard } from './Card'
import { FortGridSpec, FortGrid } from './FortGrid'
import type { Effect } from './Effect'
import { Building } from './Building'
import type { Player } from '../types'

export class Fort implements FortCard {
  id: string
  type: CardType = 'fort'
  name: string
  description: string
  gridSpec: FortGridSpec
  grid: FortGrid
  slots: number

  openSlots: number = 0
  usedSlots: number = 0
  buildings: Building[] = []
  effect?: Effect

  constructor(data: FortCard, effect?: Effect) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.gridSpec = data.gridSpec
    this.grid = new FortGrid(this.gridSpec)
    this.slots = data.slots
    this.effect = effect

    this.openSlots = this.slots
    this.usedSlots = 0
  }

  buildCubes(buildSpec: FortGridSpec): void {
    this.grid.buildSpec(buildSpec)
  }
  // Forts and Buildings are inherently linked
  addBuilding(building: Building, repairAt?: [number, number]): void {
    if (this.usedSlots < building.cost) {
      throw new Error(
        `Attempting to build ${building.id} (requires ${building.cost}) but ${this.id} only has ${this.usedSlots}`,
      )
    }
    this.buildings.push(building)
    building.fort = this
    // move colonists from here to there
    this.usedSlots -= building.cost
    building.colonists += building.cost

    if (repairAt) {
      const spec: FortGridSpec = [
        [repairAt[0], repairAt[1], building.repairColor],
      ]
      this.grid.buildSpec(spec)
    }
  }

  removeBuilding(building: Building, player?: Player): void {
    const index = this.buildings.indexOf(building)
    if (index === -1) {
      throw new Error(`Building not found in fort ${this.id}`)
    }

    this.buildings.splice(index, 1)
    building.destroy(player)
  }

  destroy(player?: Player): void {
    ;[...this.buildings].forEach(b => this.removeBuilding(b, player))
    if (player) {
      player.returnColonists(this.usedSlots)
    }
  }

  placeColonists(count: number = 1): boolean {
    if (count > this.openSlots || this.usedSlots + count > this.slots) {
      return false
    }
    this.usedSlots += count
    this.openSlots -= count
    return true
  }

  removeColonists(count: number = 1): boolean {
    if (count > this.usedSlots) {
      return false
    }
    this.usedSlots -= count
    this.openSlots += count
    return true
  }

  get colonists(): number {
    return (
      this.buildings.reduce((sum, b) => sum + b.colonists, 0) + this.usedSlots
    )
  }
}
