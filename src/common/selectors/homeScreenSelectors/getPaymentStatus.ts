import { RootState } from "@ct/common/state";
import { TxStatus } from "@ct/common/state/HomeScreen/updatePaymentStatus.slice";
import { STATE_CONSTANTS } from "@ct/constants";
import { chequeUUID, ircUUID } from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { createSelector } from "reselect";

type UseGetPaymentStatus = {
  paidAmount: number;
  paidByCard: number;
  completed: boolean;
  paidByCash: number;
  paidByCheque: number;
  paidByIRC: number;
  deductAmount: boolean;
  txStatus: TxStatus;
  cashTenderReceivedAmountTxCommited: boolean;
  cashTenderTenderedAmountTxCommited: boolean;
  cashTxCommited: boolean;
  isRepayMode: boolean;
  isCustomerToPay: boolean;
};

export const getPaymentStatus = createSelector(
  [(state: RootState) => state.updateBasket, (state: RootState) => state.updatePaymentStatus],
  (basketData, paymentStatus): UseGetPaymentStatus => {
    const { customerToPay, postOfficeTenderingAmount } = basketData;
    const paidByCash = paymentStatus?.paidByCash ?? 0;
    const paidByCheque = basketData.items.reduce((value, item) => {
      let total = 0;
      if (item.id === chequeUUID(item)) {
        total = item.total;
      }
      return value + total;
    }, 0);
    const paidByIRC = basketData.items.reduce((value, item) => {
      if (item.id === ircUUID(item)) {
        return value + item.total;
      }
      return value;
    }, 0);

    const completed = paymentStatus?.completed;
    const deductAmount = paymentStatus.deductAmount;
    const cashEntry = basketData.items.find(
      (arr) => arr.id === STATE_CONSTANTS.CASH && arr.commitStatus === STATE_CONSTANTS.SUCCESS,
    );
    const cashTxCommited = !!cashEntry;
    const cashTenderReceivedAmountTxCommited = paymentStatus.cashTenderReceivedAmountTxCommited;
    const cashTenderTenderedAmountTxCommited = paymentStatus.cashTenderTenderedAmountTxCommited;
    const paidByCard = paymentStatus.paidByCard;
    const paidAmount = paidByCash + paidByCard;
    const txStatus = paymentStatus.txStatus;
    const isRepayMode = Math.abs(postOfficeTenderingAmount) > customerToPay;
    const isCustomerToPay = basketData.basketValue > 0;

    return {
      paidAmount,
      paidByCard,
      completed,
      paidByCash,
      deductAmount,
      txStatus,
      cashTenderReceivedAmountTxCommited,
      cashTenderTenderedAmountTxCommited,
      cashTxCommited,
      isRepayMode,
      isCustomerToPay,
      paidByCheque,
      paidByIRC,
    };
  },
);
