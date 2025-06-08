import type { CardType, BuildingCard } from "./Card";
import { Fort } from "./Fort";
import type { CardEffect, CubeColor } from "../types";

export class Building implements BuildingCard {
  id: string;
  type: CardType = "building";
  name: string;
  description: string;
  cost: number;
  coins: number;
  colonists: number;
  repairColor: CubeColor;
  effect?: CardEffect;
  fort?: Fort;
  usedRepair: boolean = false;

  constructor(data: BuildingCard, effect?: CardEffect) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.cost = data.cost;
    this.coins = data.coins;
    this.colonists = data.colonists;
    this.repairColor = data.repairColor;
    this.effect = effect;
  }

  applyRepair(): boolean {
    if (!this.fort) {
      return false;
    }
    // TODO
    // Check fort grid for empty space ('.')
    // Probably use same logic as when Fort Cells are populated.
    return true;
  }
}
