import { createSelector } from "reselect";
import { RootState } from "../state";

export const getPouchAcceptanceList = createSelector(
  [(state: RootState) => state.pouchAcceptanceList],
  (pouchAcceptanceList) => pouchAcceptanceList,
);
export const getScannedPouchForAcceptance = createSelector(
  [(state: RootState) => state.updateScannedPouchForAcceptance],
  (updateScannedPouchForAcceptance) => updateScannedPouchForAcceptance,
);
