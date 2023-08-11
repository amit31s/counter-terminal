import { createSelector } from "reselect";
import { RootState } from "../state";

export const getPrintedReceipts = createSelector(
  [(state: RootState) => state.printedReceipts],
  (printedReceipts) => printedReceipts,
);
