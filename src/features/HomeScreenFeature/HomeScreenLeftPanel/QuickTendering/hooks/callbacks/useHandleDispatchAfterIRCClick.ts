import { getBasket, ircItemID, useAppDispatch, useAppSelector, useCommitBasket } from "@ct/common";
import { updatePaymentStatus } from "@ct/common/state/HomeScreen";
import { CommitStatus, updateBasket } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { EntryType, IbasketItem } from "@ct/interfaces";
import { preUpdateBasket, uuid } from "@ct/utils";
import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { commitPayments } from "./commitPayments";

export function useHandleDispatchAfterIRCClick(
  setIRCPaymentCompleted: Dispatch<SetStateAction<boolean>>,
) {
  const dispatch = useAppDispatch();
  const { basketItems, basketValue } = useAppSelector(getBasket);
  const { commitCashEntry } = useCommitBasket();

  return useCallback(
    async (amount: number, name: string) => {
      dispatch(
        updatePaymentStatus({
          completed: false,
          deductAmount: false,
        }),
      );

      const basketArray: IbasketItem[] = cloneDeep(basketItems);
      const localUUID = uuid();
      const ircEntry: IbasketItem = {
        price: 0,
        id: ircItemID + localUUID,
        name,
        type: EntryType.paymentMode,
        total: -amount,
        deductAmount: false,
        commitStatus: CommitStatus.notInitiated,
        fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_INITIATED,
        quantity: 0,
        additionalItemsValue: 0,
        source: "local",
        localUUID: localUUID,
      };
      basketArray.push(ircEntry);

      dispatch(updateBasket(preUpdateBasket(basketArray)));
      const absoluteBasketValue = Math.abs(basketValue);
      if (absoluteBasketValue - amount <= 0) {
        commitPayments(dispatch, basketArray, commitCashEntry, setIRCPaymentCompleted);
      }
    },
    [basketItems, basketValue, commitCashEntry, dispatch, setIRCPaymentCompleted],
  );
}
