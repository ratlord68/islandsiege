import type { CardType, FortGridCell, CubeColor } from "../types";

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
}

export interface FortCard extends Card {
  grid: FortGridCell[][];
  slots: number; // number of colonist slots
}

export interface BuildingCard extends Card {
  cost: number; // colonists required on fort
  coins: number; // coins awarded when played
  colonists: number; // number of colonists on this building
  repair: CubeColor; // cube color to use for repair when played - AFAIK, always singular.
}

export interface ShipCard extends Card {
  cost: number; // colonists required on fort
  coins: number; // coins awarded when played
  colonists: number; // number of colonists on this ship
}
