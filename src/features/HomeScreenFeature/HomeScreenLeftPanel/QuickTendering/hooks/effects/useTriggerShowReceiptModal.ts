import {
  getBasket,
  getFulfillmentData,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { FulfillmentStatusEnum } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { LoadingId, setLoadingInactive } from "@ct/common/state/loadingStatus.slice";
import { Dispatch, SetStateAction, useEffect } from "react";
import { allItemsCommited } from "../../../../homeScreen.helper";
import { getNoInternetModalStatus } from "@ct/common/selectors/common/noInternetSelector";

export function useTriggerShowReceiptModal(
  isReceiptModalOpen: boolean,
  setIsReceiptModalOpen: Dispatch<SetStateAction<boolean>>,
  setWillPerformAfterPaymentCommit: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();

  const { isVisible, isVisibleNetworkRestored } = useAppSelector(getNoInternetModalStatus);
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const { isCustomerToPay, txStatus } = useAppSelector(getPaymentStatus);

  const { fulfillmentStatus } = useAppSelector(getFulfillmentData);

  useEffect(() => {
    if (isVisible || isVisibleNetworkRestored) {
      setIsReceiptModalOpen(false);
      return;
    }

    if (isReceiptModalOpen || !allItemsCommited(basketItems)) {
      return;
    }

    if (fulfillmentStatus === FulfillmentStatusEnum.SUCCESS && txStatus === "completed") {
      dispatch(setLoadingInactive(LoadingId.TENDERING));
      setWillPerformAfterPaymentCommit(false);
      setIsReceiptModalOpen(true);
    }
  }, [
    basketItems,
    basketValue,
    dispatch,
    fulfillmentStatus,
    isCustomerToPay,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    setWillPerformAfterPaymentCommit,
    txStatus,
    isVisible,
    isVisibleNetworkRestored,
  ]);
}
