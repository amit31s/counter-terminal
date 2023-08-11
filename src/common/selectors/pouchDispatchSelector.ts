import { createSelector } from "reselect";
import { RootState } from "../state";

export const getPouchDispatchList = createSelector(
  [(state: RootState) => state.updatePouchDispatchList],
  (updatePouchDispatchList) => updatePouchDispatchList,
);
export const getAccCard = createSelector(
  [(state: RootState) => state.updateAccCard],
  (updateAccCard) => updateAccCard,
);
