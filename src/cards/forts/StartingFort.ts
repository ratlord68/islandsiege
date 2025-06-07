import { Effect } from "../../types";

//   "type": "fort",
//   "name": "Starting Fort",
//   "grid": [
//     [1, 0, "W"],
//     [1, 1, "G"],
//     [1, 2, "G"],
//     [1, 3, "B"]
//   ],
//   "slots": 4,
//   "description": "Add [B,W] to your supply. Draw three cards then give one to your opponent.",
//   "id": 0

export const StartingFort: Effect = {
  id: "fort-starting",
  name: "Starting Fort",

  onBuild: (gameState, player) => {
    player.addCubes({ black: 1, white: 1 });
  },
};
