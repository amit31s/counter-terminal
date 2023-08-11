import {
  getBasket,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
  useCommitBasket,
} from "@ct/common";
import { updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { CommitStatus, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { EntryType, IbasketItem } from "@ct/interfaces";
import { preUpdateBasket, uuid } from "@ct/utils";
import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { commitPayments } from "./commitPayments";

export function useHandleDispatchAfterChequeClick(
  setCashPaymentCompleted: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { isCustomerToPay } = useAppSelector(getPaymentStatus);
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const { commitCashEntry } = useCommitBasket();

  return useCallback(
    async (amount: number, deductAmount = false) => {
      dispatch(
        updatePaymentStatus({
          completed: false,
          deductAmount,
        }),
      );

      const updatedChequePayment = Number(Math.abs(amount).toFixed(2)) * (isCustomerToPay ? -1 : 1);
      const basketArray: IbasketItem[] = cloneDeep(basketItems);
      const localUUID = uuid();
      const chequeEntry: IbasketItem = {
        price: 0,
        id: STATE_CONSTANTS.CHEQUE + localUUID,
        name: "Cheque",
        type: EntryType.paymentMode,
        total: updatedChequePayment,
        deductAmount: deductAmount,
        commitStatus: CommitStatus.notInitiated,
        fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_INITIATED,
        quantity: 0,
        additionalItemsValue: 0,
        source: "local",
        localUUID: localUUID,
      };
      basketArray.push(chequeEntry);

      dispatch(updateBasket(preUpdateBasket(basketArray)));
      const absoluteBasketValue = Math.abs(basketValue);
      if (absoluteBasketValue - amount <= 0 || deductAmount) {
        commitPayments(dispatch, basketArray, commitCashEntry, setCashPaymentCompleted);
      }
    },
    [basketItems, basketValue, commitCashEntry, dispatch, isCustomerToPay, setCashPaymentCompleted],
  );
}
