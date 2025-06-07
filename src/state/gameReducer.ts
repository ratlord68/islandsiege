import { GameState, Player } from "../types";
import { ActionTypes } from "./actions";

type Action =
  | { type: "INIT_GAME"; payload: { names: string[] } }
  | { type: "COLONIST_PHASE" }
  | { type: "ACTION_PHASE" }
  | { type: "ATTACK" }
  | { type: "NEXT_TURN" }
  | { type: "CHECK_WIN" };

export const gameReducer = (state: GameState, action: Action): GameState => {
  const currentPlayer = state.players[state.currentPlayerIndex];

  switch (action.type) {
    case ActionTypes.INIT_GAME: {
      const players: Player[] = action.payload.names.map((name, index) => ({
        id: `P${index + 1}`,
        name,
        coins: 0,
        hand: [],
        forts: [
          {
            id: `fort-${index + 1}`,
            name: "Starting Fort",
            colonistSlots: 3,
            placedColonists: 0,
          },
        ],
        ships: [],
        buildings: [],
        colonists: 9,
        cubes: { black: 1, white: 1, gray: 0 },
        attack_dice: 2,
        rerolls: 1,
      }));

      const randomIndex = Math.floor(Math.random() * players.length);

      return {
        players,
        currentPlayer: randomIndex,
        winner: null,
        phase: "initDraw",
      };
    }

    case ActionTypes.COLONIST_PHASE: {
      if (currentPlayer.colonists > 0 && availableSlots(currentPlayer.forts)) {
        const updatedPlayer: Player = {
          ...currentPlayer,
          supply: currentPlayer.supply - 1,
          fort: {
            ...currentPlayer.fort,
            placedColonists: currentPlayer.fort.placedColonists + 1,
          },
        };

        const updatedPlayers = [...state.players];
        updatedPlayers[state.currentPlayerIndex] = updatedPlayer;

        return {
          ...state,
          players: updatedPlayers,
          phase: "action",
        };
      }
    }

    case ActionTypes.ACTION_PHASE: {
      // Action - return fleet and take one of the following sub-actions
      //  1. Draw cards - draw 3, keep 2 and give 1 to opponent
      //  2. Build (Fort) - play from hand to tableau, add designed cube from general supply, add other cubes from personal supply (score 1 coin per cube)
      //  3. Build (Building) - play from hand to fort, move colonists from fort to building, repair fort, score coins
      //  4. Build (Ship) - play from hand to tableau, move colonists from (single) fort to ship, score coins
      //  5. Attack - move ship to fort
      return {
        ...state,
        phase: "attack",
      };
    }

    case ActionTypes.ATTACK: {
      // For now, stub — we'll implement real logic later
      return {
        ...state,
        phase: "placeColonist",
      };
    }

    case ActionTypes.NEXT_TURN: {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        phase: "placeColonist",
      };
    }

    case ActionTypes.CHECK_WIN: {
      if (currentPlayer.supply === 0 || currentPlayer.coins >= 20) {
        return {
          ...state,
          winner: currentPlayer.id,
        };
      }
      return state;
    }

    default:
      return state;
  }
};
