export const ActionTypes = {
  // Game Setup
  INIT_GAME: "INIT_GAME",
  RESET_GAME: "RESET_GAME",
  // Automatic Phases
  VICTORY_PHASE: "VICTORY_PHASE",
  COLONIST_PHASE: "COLONIST_PHASE",
  INIT_DRAW: "INIT_DRAW",
  ACTION_PHASE: "ACTION_PHASE",
  // Sub-actions
  DRAW_CARDS: "DRAW_CARDS",
  PLAY_FORT: "PLAY_FORT",
  PLAY_BUILDING: "PLAY_BUILDING",
  PLAY_SHIP: "PLAY_SHIP",
  ATTACK_WAVE1: "ATTACK_WAVE1",
  ATTACK_WAVE2: "ATTACK_WAVE2",
  ATTACK_REINFORCE: "ATTACK_REINFORCE",

  // Post-Action Phase
  END_TURN: "END_TURN",
} as const;

// Game Phases
// Victory - check if player has 0 colonists or >20 gold
// Colonize - move colonists to empty fort spaces
// Action - return fleet and take one of the following sub-actions
//  1. Draw cards - draw 3, keep 2 and give 1 to opponent
//  2. Build (Fort) - play from hand to tableau, add designed cube from general supply, add other cubes from personal supply (score 1 coin per cube)
//  3. Build (Building) - play from hand to fort, move colonists from fort to building, repair fort, score coins
//  4. Build (Ship) - play from hand to tableau, move colonists from (single) fort to ship, score coins
//  5. Attack - move ship to fort
//      5a. Roll dice, use up to # of rerolls
//      5b. Leadership - resolve ship symbols (ship abilities, ship destruction)
//          5b1. Ship - If ship is destroyed, return colonists
//      5c. First wave (fort) - select 1 color (black, gray, white) and use all of that color
//      5d. Choose
//          5d1. Reinforce - add 1 cube to supply for remaining colored dice
//          5d2. Second Wave - resolve red
//      5e. Destruction - If no cubes left, destroy fort and buildings, return colonists

export type ActionType = (typeof ActionTypes)[keyof typeof ActionTypes];
