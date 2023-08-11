import { createSelector } from "reselect";
import { RootState } from "../state";

export const touchKeyboardSelector = createSelector(
  [(state: RootState) => state.touchKeyboard],
  (touchKeyboard) => touchKeyboard,
);
