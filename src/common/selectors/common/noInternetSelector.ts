import { createSelector } from "reselect";
import { RootState } from "../../state";

export const getNoInternetModalStatus = createSelector(
  [(state: RootState) => state.noNetwork],
  (noNetwork) => noNetwork,
);
