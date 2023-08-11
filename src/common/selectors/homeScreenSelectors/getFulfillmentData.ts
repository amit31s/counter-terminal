import { RootState } from "@ct/common/state";
import {
  FulFillmentItem,
  FulfillmentStatusEnum,
} from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { createSelector } from "@reduxjs/toolkit";

type UseGetFulfillmentData = {
  fulfillmentRequired: boolean;
  fulfillmentStatus: FulfillmentStatusEnum;
  items: FulFillmentItem[];
  failedItems: FulFillmentItem[];
  successItems: FulFillmentItem[];
};

export const getFulfillmentData = createSelector(
  [(state: RootState) => state.updateFulfillment],
  (fulfillmentData): UseGetFulfillmentData => {
    const fulfillmentRequired = fulfillmentData.fulfillmentRequired;
    const fulfillmentStatus = fulfillmentData.fulfillmentStatus;
    const items = fulfillmentData.item;
    const failedItems = items.filter(
      (item) => item.fulfillmentStatus === FulfillmentStatusEnum.FAILED,
    );
    const successItems = items.filter(
      (item) => item.fulfillmentStatus === FulfillmentStatusEnum.SUCCESS,
    );
    return {
      fulfillmentRequired,
      fulfillmentStatus,
      failedItems,
      successItems,
      items,
    };
  },
);
