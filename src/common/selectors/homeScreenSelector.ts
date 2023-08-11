import { createSelector } from "reselect";
import { RootState } from "../state";

export const getHomeScreenStage = createSelector(
  [(state: RootState) => state.updateHomeScreenStage],
  (updateHomeScreenStage) => updateHomeScreenStage,
);

export const getNumpadFlag = createSelector(
  [(state: RootState) => state.updateNumpadFlagStatus],
  (updateNumpadFlagStatus) => updateNumpadFlagStatus,
);
export const getQuantityFlag = createSelector(
  [(state: RootState) => state.updateQuantityFlag],
  (updateQuantityFlag) => updateQuantityFlag,
);
export const getJourneyStatus = createSelector(
  [(state: RootState) => state.updateJourneyStatus],
  (updateJourneyStatus) => updateJourneyStatus,
);

export const getUpDownArrow = createSelector(
  [(state: RootState) => state.updateUpDownArrow],
  (updateUpDownArrow) => updateUpDownArrow,
);

export const getReceiptData = createSelector(
  [(state: RootState) => state.updateRecieptData],
  (updateRecieptData) => updateRecieptData,
);

export const getSalesReceipt = createSelector(
  [(state: RootState) => state.updateSalesReceipt],
  (updateSalesReceipt) => updateSalesReceipt,
);
export const getSuspendBasketNotification = createSelector(
  [(state: RootState) => state.updateSuspendBasketNotification],
  (updateSuspendBasketNotification) => updateSuspendBasketNotification,
);
