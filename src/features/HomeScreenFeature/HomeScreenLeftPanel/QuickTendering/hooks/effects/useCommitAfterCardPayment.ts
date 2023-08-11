import {
  getBasket,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { updateTxStatus } from "@ct/common/state/HomeScreen";
import { isNetworkError } from "@ct/utils";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useCommitAfterCardPayment(
  isTransactionCompletedByCard: boolean,
  setTransactionCompletedByCard: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { commitBasket } = useCommitBasket();
  const { paidAmount } = useAppSelector(getPaymentStatus);
  const { basketItems } = useAppSelector(getBasket);

  useEffect(() => {
    if (!isTransactionCompletedByCard) {
      return;
    }
    setTransactionCompletedByCard(false);
    (async () => {
      const resp = await commitBasket({
        basketItems,
        txStatus: "completed",
        paidAmount: paidAmount,
      });
      if (isNetworkError(resp)) {
        dispatch(showNoNetworkModal());
        return;
      }
      dispatch(updateTxStatus());
    })();
  }, [
    basketItems,
    commitBasket,
    dispatch,
    isTransactionCompletedByCard,
    paidAmount,
    setTransactionCompletedByCard,
  ]);
}
