import { createSelector } from "reselect";
import { RootState } from "../state";

export const getLoadingStatus = createSelector(
  [(state: RootState) => state.loadingStatus],
  (loadingStatus) => loadingStatus,
);
