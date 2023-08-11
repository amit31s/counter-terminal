import { createSelector } from "reselect";
import { RootState } from "../state";

export const cashTransferSelector = createSelector(
  [(state: RootState) => state.cashTransfer],
  (cashTransfer) => cashTransfer,
);
