import { FortRegistry } from './forts'
import { ShipRegistry } from './ships'
import { BuildingRegistry } from './buildings'

export const CardRegistry = {
  ...FortRegistry,
  ...ShipRegistry,
  ...BuildingRegistry,
}
