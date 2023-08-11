import { getBasket, useAppDispatch, useAppSelector, useCommitBasket } from "@ct/common";
import { showNoNetworkModal } from "@ct/common/state/common/noNetwork.slice";
import { updateTxStatus } from "@ct/common/state/HomeScreen";
import { isNetworkError } from "@ct/utils";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useCommitAfterCashPayment(
  cashPaymentCompleted: boolean,
  setCashPaymentCompleted: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { commitBasket } = useCommitBasket();
  const { basketItems } = useAppSelector(getBasket);

  useEffect(() => {
    if (!cashPaymentCompleted) {
      return;
    }
    setCashPaymentCompleted(false);
    (async () => {
      const resp = await commitBasket({ basketItems, txStatus: "completed" });
      if (isNetworkError(resp)) {
        dispatch(showNoNetworkModal());
        return;
      }
      dispatch(updateTxStatus());
    })();
  }, [basketItems, cashPaymentCompleted, commitBasket, dispatch, setCashPaymentCompleted]);
}
