export const GamePhases = {
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
};

function advancePhase(state: GameState): GameState {
  switch (state.phase) {
    case "initDraw":
      return initDrawPhase(state);
    case "victory":
      return checkVictory(state);
    case "colonist":
      return colonistPhase(state);
    case "action":
      return actionPhase(state);
    case "draw":
      return drawPhase(state);
    case "build":
      return buildPhase(state);
    case "attack":
      return attackPhase(state);
    case "reroll":
      return rerollPhase(state);
    case "endTurn":
      return endTurn(state);
    case "victory":
      return checkVictory(state);
    case "gameEnd":
      return endGame(state);
    default:
      throw new Error(`Unknown phase: ${state.phase}`);
  }
}
