export type CardEffect = {
  id: string;
  onPlayerAttack?: (gameState: GameState, player: Player) => GameState; // e.g. "look at hand"
  onOpponentAttack?: (gameState: GameState, player: Player) => GameState; // e.g. "cannot reroll"
  onLeadership?: (gameState: GameState, player: Player) => GameState; // e.g. "gain 1 reroll"
  onSecondWave?: (gameState: GameState, player: Player) => GameState; // e.g. "gain 1 reroll"
  onShipDestroyed?: (gameState: GameState, player: Player) => GameState; // e.g. "return to hand"
  onPlayBuilding?: (gameState: GameState, player: Player) => GameState; // e.g. "gain 1 coin"
  onOpponentBuild?: (gameState: GameState, player: Player) => GameState; // e.g. "1 less coin"
  // from quick scan of cards, more might be needed
};

export type Player = {
  id: string;
  name: string;
  coins: number;
  hand: Card[];
  buildings: Building[];
  forts: Fort[];
  ships: Ship[];
  colonists: number; // remaining colonists on player board
  cubes: CubeReserve; // personal cube supply

  // TODO: extra actions unlocked with colonists?
  attack_dice: number;
  rerolls: number;
};

export type Phase =
  | "initGame"
  | "initDraw"
  | "victory"
  | "colonist"
  | "action"
  | "draw"
  | "build"
  | "attack"
  | "reroll"
  | "endTurn"
  | "gameEnd";

export type Game = {
  id: string;
  state: GameState;
};

export type GameState = {
  players: Player[];
  currentPlayer: Player;

  // ordered bottom -> top
  deck: Card[];
  discardPile: Card[];
  phase: Phase;
};

export type CubeColor = "black" | "white" | "gray";

// Establish one for each player, and one general
export type CubeReserve = {
  black?: number;
  white?: number;
  gray?: number;
};
