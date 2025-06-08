import type { CardType, FortCard } from "./Card";
import type { FortGridSpec, FortGrid } from "./FortGrid";
import type { CardEffect, CubeColor } from "../types";
import { Building } from "./Building";

export class Fort implements FortCard {
  id: string;
  type: CardType = "fort";
  name: string;
  description: string;
  gridSpec: FortGridSpec;
  grid: FortGrid;
  slots: number;

  // Additional fields
  openSlots: number;
  usedSlots: number;
  buildings: Building[] = [];
  effect?: CardEffect;

  constructor(data: FortCard, effect?: CardEffect) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.gridSpec = data.gridSpec;
    this.grid = createFortGrid(this.gridSpec);
    this.slots = data.slots;
    this.effect = effect;

    this.openSlots = this.slots;
    this.usedSlots = 0;
  }

  addBuilding(building: Building): void {
    this.buildings.push(building);
    building.fort = this;
    building.applyRepair();
  }

  placeColonist(): boolean {
    if (this.openSlots > 0) {
      this.usedSlots++;
      this.openSlots--;
      return true;
    }
    return false;
  }

  removeColonist(): boolean {
    if (this.usedSlots > 0) {
      this.usedSlots--;
      this.openSlots++;
      return true;
    }
    return false;
  }

  get colonists(): number {
    return (
      this.buildings.reduce((sum, b) => sum + b.colonists, 0) + this.usedSlots
    );
  }
}

export function createFortGrid(gridSpec: FortGridSpec): FortGrid {
  const size = 4;
  const grid: FortGrid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ type: "NaC" })),
  );

  for (const [row, col, val] of gridSpec) {
    if (row >= size || col >= size) {
      throw new Error(`Invalid grid position: (${row}, ${col})`);
    }

    grid[row][col] = {
      type: "cube",
      color: val === "." ? null : cubeSymbolToColor(val),
    };
  }

  return grid;
}

function cubeSymbolToColor(symbol: string): CubeColor {
  switch (symbol) {
    case "B":
      return "black";
    case "W":
      return "white";
    case "G":
      return "gray";
    default:
      throw new Error(`Unknown cube symbol: ${symbol}`);
  }
}
