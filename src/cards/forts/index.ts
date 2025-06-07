import { StartingFort } from "./StartingFort";
import { FortBehavior } from "../../types";

export const fortRegistry: Record<string, FortBehavior> = {
  [StartingFort.id]: StartingFort,
  // add more here later
};
