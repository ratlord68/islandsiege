export type CardType = 'building' | 'fort' | 'ship';

// Base type for all cards in the game
export type Card = {
    id: string;
    type: CardType;
    name: string;
    description: string;
}

// The following types extend the base type for the specific card types
// Contains all information needed to render in hand
export type FortCard = Card & {
    grid: FortGridCell[][];
    slots: number;  // number of colonist slots
}

export type BuildingCard = Card & {
    cost: number;   // colonists required on fort
    coins: number;  // coins awarded when played
    repair: CubeColor[];  // cubes to use for repair when played
};

export type ShipCard = Card & {
    cost: number;  // colonists required on fort
    colonists: number;  // number of colonists on this ship
    coins: number;  // coins awarded when played
}

// These types contain all information once cards have been placed in tableau
export type Fort = FortCard & {
    openSlots: number;  // number of open slots for colonists
    buildings: [];
    effect?: CardEffect;
};

export type Building = BuildingCard & {
    colonists: number;  // number of colonists placed on this building
    effect?: CardEffect;
};


export type Ship = ShipCard & {
    colonists: number;
    effect?: CardEffect;
};

export type CardEffect = {
    id: string;
    onPlayerAttack?: (gameState: GameState, player: Player) => GameState;  // e.g. "look at hand"
    onOpponentAttack?: (gameState: GameState, player: Player) => GameState;  // e.g. "cannot reroll"
    onLeadership?: (gameState: GameState, player: Player) => GameState;  // e.g. "gain 1 reroll"
    onSecondWave?: (gameState: GameState, player: Player) => GameState;  // e.g. "gain 1 reroll"
    onShipDestroyed?: (gameState: GameState, player: Player) => GameState;  // e.g. "return to hand"
    onPlayBuilding?: (gameState: GameState, player: Player) => GameState;  // e.g. "gain 1 coin"
    onOpponentBuild?: (gameState: GameState, player: Player) => GameState;  // e.g. "1 less coin"
    // from quick scan of cards, more might be needed
}

export type Player = {
    id: string;
    name: string;
    coins: number;
    hand: Card[];
    buildings: Building[];
    forts: Fort[];
    ships: Ship[];
    colonists: number;  // remaining colonists on player board
    cubes: CubeReserve;  // personal cube supply

    // TODO: extra actions unlocked with colonists?
    attack_dice: number;
    rerolls: number;
}

export type GameState = {
    players: Player[];
    currentPlayerIndex: number;
    winner: string | null;
    phase: 'init_draw' | 'check_victory' | 'place_conlonists' | 'action' | 'draw' | 'play' | 'attack' | 'end_turn';
};

export type CubeColor = 'black' | 'white' | 'gray';

export type CubeReserve = {
  black: number;
  white: number;
  gray: number;
}

export type FortGridCell =
  | { type: 'cube'; color: CubeColor | null }
  | { type: 'NaC' };  // Not a Cell, space should remain empty

// globals
// Deck Pile
// Discard Pile
// Cube Supply
// Coin Supply