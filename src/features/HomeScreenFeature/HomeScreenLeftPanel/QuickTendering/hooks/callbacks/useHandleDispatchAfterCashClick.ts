import {
  getBasket,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { updateCashPayment, updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { CommitStatus, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { EntryType, IbasketItem } from "@ct/interfaces";
import { preUpdateBasket } from "@ct/utils";
import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { commitPayments } from "./commitPayments";

export function useHandleDispatchAfterCashClick(
  setCashPaymentCompleted: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { isCustomerToPay } = useAppSelector(getPaymentStatus);
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const { commitCashEntry } = useCommitBasket();

  return useCallback(
    async (cashPayment: number, amount: number, deductAmount = false) => {
      dispatch(
        updatePaymentStatus({
          completed: false,
          deductAmount,
        }),
      );

      const totalPayment = Number(Math.abs(cashPayment + amount).toFixed(2));
      const updatedCashPayment = totalPayment * (isCustomerToPay ? -1 : 1);
      const basketArray: IbasketItem[] = cloneDeep(basketItems);
      dispatch(updateCashPayment(updatedCashPayment));

      let cashEntry = basketArray.find((arr) => arr.id === STATE_CONSTANTS.CASH);
      if (!cashEntry) {
        cashEntry = {
          price: 0,
          id: STATE_CONSTANTS.CASH,
          name: "Cash",
          type: EntryType.paymentMode,
          source: "local",
          total: updatedCashPayment,
          deductAmount: deductAmount,
          commitStatus: CommitStatus.notInitiated,
          fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_INITIATED,
          quantity: 0,
          additionalItemsValue: 0,
        };
        basketArray.push(cashEntry);
      } else {
        cashEntry.total = updatedCashPayment;
      }
      dispatch(updateBasket(preUpdateBasket(basketArray)));
      const absoluteBasketValue = Math.abs(basketValue);
      if (absoluteBasketValue - amount <= 0 || deductAmount) {
        const cashPaymentToCommit =
          (isCustomerToPay ? -1 : 1) * (cashPayment + absoluteBasketValue);
        commitPayments(
          dispatch,
          basketArray,
          commitCashEntry,
          setCashPaymentCompleted,
          cashPaymentToCommit,
        );
      }
    },
    [basketItems, basketValue, commitCashEntry, dispatch, isCustomerToPay, setCashPaymentCompleted],
  );
}
