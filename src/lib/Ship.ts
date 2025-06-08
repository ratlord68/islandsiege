import type { CardType, ShipCard } from "../Card";
import type { CardEffect } from "../../types";

export class Ship implements ShipCard {
  id: string;
  type: CardType = "ship";
  name: string;
  description: string;
  cost: number;
  coins: number;
  colonists: number;
  effect?: CardEffect;

  constructor(data: ShipCard, effect?: CardEffect) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.cost = data.cost;
    this.coins = data.coins;
    this.colonists = data.colonists;
    this.effect = effect;
  }
}
