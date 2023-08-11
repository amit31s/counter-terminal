import { RootState } from "../state";
import { createSelector } from "reselect";

export const getCommitApiStatus = createSelector(
  [(state: RootState) => state.updateCommitApiStatusFlag],
  (updateCommitApiStatusFlag) => updateCommitApiStatusFlag,
);
