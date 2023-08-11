import { RootState } from "@ct/common/state";
import { createSelector } from "@reduxjs/toolkit";

type UseGetFulfillmentError = {
  noticeId: string | undefined;
  noticeDescription: string | undefined;
  uuid: string;
};

export const getFulfillmentError = createSelector(
  [(state: RootState) => state.updateFulfillmentError],
  (fulfillmentData): UseGetFulfillmentError => {
    const noticeId = fulfillmentData.errorResponse?.notice?.id;
    const noticeDescription = fulfillmentData.errorResponse?.notice?.description;
    const uuid = fulfillmentData?.uuid ?? "";
    return {
      noticeId,
      noticeDescription,
      uuid,
    };
  },
);
