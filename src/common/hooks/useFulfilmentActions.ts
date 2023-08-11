import {
  getBasket,
  getFulfillmentData,
  getPaymentStatus,
  useAppDispatch,
  useAppSelector,
  useGetBasketItemToCommit,
} from "@ct/common";
import { STATE_CONSTANTS, TEXT, stringConstants } from "@ct/constants";
import { EntryType, IbasketItem } from "@ct/interfaces/basket.interface";
import { preUpdateBasket } from "@ct/utils";
import { clone, cloneDeep } from "lodash";
import { CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import { useCallback, useEffect, useState } from "react";
import { CommitStatus, updateBasket } from "../state/HomeScreen/updateBasket.slice";
import { FulfillmentStatusEnum } from "../state/HomeScreen/updateFulfillment.slice";
import { LoadingId, setLoadingActive, setLoadingInactive } from "../state/loadingStatus.slice";

export type SettleWithCashState = "NOT_INITIATED" | "YES" | "NO";

export const useFulfilmentActions = (
  settleWithCashState: SettleWithCashState = "NOT_INITIATED",
) => {
  const { successItems, fulfillmentRequired, fulfillmentStatus } =
    useAppSelector(getFulfillmentData);
  const { basketItems } = useAppSelector(getBasket);
  const { getTenderAmountToCommit } = useGetBasketItemToCommit();
  const { cashTenderReceivedAmountTxCommited, cashTenderTenderedAmountTxCommited } =
    useAppSelector(getPaymentStatus);
  const dispatch = useAppDispatch();
  const [settleWithCash, setSettleWithCash] = useState<SettleWithCashState>(settleWithCashState);

  const onYesPress = useCallback(() => {
    setSettleWithCash("YES");
    dispatch(setLoadingInactive(LoadingId.SETTLE_WITH_CASH));
  }, [dispatch]);

  const onNoPress = useCallback(() => {
    setSettleWithCash("NO");
    dispatch(setLoadingInactive(LoadingId.SETTLE_WITH_CASH));
  }, [dispatch]);

  useEffect(() => {
    const lastSuccessItems = successItems.slice(-1)[0];
    const basketArray: IbasketItem[] = cloneDeep(basketItems);
    const lastItem: IbasketItem = clone(basketArray.slice(-1)[0]) ?? ({} as IbasketItem);
    const id = lastSuccessItems?.id;
    if (
      id === lastItem.journeyData?.transaction.uniqueID &&
      lastSuccessItems?.fulfillmentStatus === FulfillmentStatusEnum.SUCCESS &&
      lastItem.journeyData?.transaction?.cashTenderTendered === "true"
    ) {
      if (settleWithCash === "NOT_INITIATED") {
        dispatch(
          setLoadingActive({
            id: LoadingId.SETTLE_WITH_CASH,
            modalProps: {
              icon: false,
              title:
                lastItem.journeyData?.transaction?.tokens?.cashTenderMessage ?? TEXT.CTTXT00078,
              primaryButtonProps: {
                label: stringConstants.Button.BTN_YES,
                onPress: onYesPress,
              },
              secondaryButtonProps: {
                label: stringConstants.Button.BTN_NO,
                onPress: onNoPress,
              },
            },
          }),
        );
        return;
      }
      if (settleWithCash === "YES") {
        lastItem.price = lastItem.price * -1;
        lastItem.total = lastItem.total * -1;
        lastItem.quantity = lastItem.quantity * -1;
        getTenderAmountToCommit(lastItem).then((dataToCommit) => {
          for (const basketItem of dataToCommit ?? []) {
            const uniqueID = `${basketItem.uniqueID}_${STATE_CONSTANTS.CASH}`;
            const transaction = {
              ...basketItem,
              uniqueID: uniqueID,
              commitAndFulfillPoint: CommitAndFulfillPointEnum.Immediate,
            };
            basketArray.push({
              entryID: basketItem.entryID,
              name: "Cash",
              id: uniqueID,
              price: lastItem.price,
              total: lastItem.total,
              quantity: lastItem.quantity,
              source: "local",
              type: EntryType.paymentMode,
              commitStatus: CommitStatus.notInitiated,
              doNotShow: false,
              fulFillmentStatus: STATE_CONSTANTS.FULFILLMENT_NOT_REQUIRED,
              journeyData: { transaction },
              additionalItemsValue: 0,
            });
            dispatch(updateBasket(preUpdateBasket(basketArray)));
            setSettleWithCash("NOT_INITIATED");
          }
        });
      }
    } else {
      setSettleWithCash("NOT_INITIATED");
    }
  }, [
    basketItems,
    cashTenderReceivedAmountTxCommited,
    cashTenderTenderedAmountTxCommited,
    dispatch,
    fulfillmentRequired,
    fulfillmentStatus,
    getTenderAmountToCommit,
    onNoPress,
    onYesPress,
    settleWithCash,
    successItems,
  ]);
};
