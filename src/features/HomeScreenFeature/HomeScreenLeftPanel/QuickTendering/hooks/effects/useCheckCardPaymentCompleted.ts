import { getFulfillmentData, useAppSelector } from "@ct/common";
import { FulfillmentStatusEnum } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useCheckCardPaymentCompleted(
  paymentUUID: string | null,
  setPaymentUUID: Dispatch<SetStateAction<string | null>>,
) {
  const { items: fulfillmentItems } = useAppSelector(getFulfillmentData);

  useEffect(() => {
    if (paymentUUID === null) return;
    const fulfillmentItem = fulfillmentItems.find(({ id }) => id === paymentUUID);

    if (
      !fulfillmentItem ||
      fulfillmentItem.fulfillmentStatus === FulfillmentStatusEnum.NOT_INITIATED
    )
      return;
    setPaymentUUID(null);

    if (fulfillmentItem.fulfillmentStatus !== FulfillmentStatusEnum.SUCCESS) return;
  }, [fulfillmentItems, paymentUUID, setPaymentUUID]);
}
