export type CardType = 'building' | 'fort' | 'ship';

export type Card = {
    id: string;
    type: CardType;
    name: string;
    cost: number;
}

export type Fort = {
    id: string;
    name: string;
    colonistSlots: number;
    placedColonists: number;
    buildings: [];
    effect?: Effect;
};

export type Effect = {
    onPlayerAttack?: (gameState: GameState, player: Player) => GameState;  // e.g. "look at hand"
    onOpponentAttack?: (gameState: GameState, player: Player) => GameState;  // e.g. "cannot reroll"
    onSecondWave?: (gameState: GameState, player: Player) => GameState;  // e.g. "gain 1 reroll"
    onShipDestroyed?: (gameState: GameState, player: Player) => GameState;  // e.g. "return to hand"
    onPlayBuilding?: (gameState: GameState, player: Player) => GameState;  // e.g. "gain 1 coin"
    onOpponentBuild?: (gameState: GameState, player: Player) => GameState;  // e.g. "1 less coin"
    // from quick scan of cards, more might be needed
}

export type Building = {
    id: string;
    name: string;
    ability: string;
    placedColonists: number;
    effect?: string;
};


export type Ship = {
    id: string;
    name: string;
    ability: string;
    coins: number;
    placedColonists: number;
    effect?: string;
};

export type Player = {
    id: string;
    name: string;
    coins: number;
    hand: Card[];
    buildings: Building[];
    forts: Fort[];
    ships: Ship[];
    // fleet: object;
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

export type FortCell =
  | { type: 'cube'; color: CubeColor | null }
  | { type: 'NaC' };  // Not a Cell, space should remain empty

// globals
// Deck Pile
// Discard Pile
// Cube Supply
// Coin Supply