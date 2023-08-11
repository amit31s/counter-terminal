import { TxStatus } from "../HomeScreen/updatePaymentStatus.slice";

export const defaultPaymentStatusData = () => ({
  time: 0,
  completed: false,
  paidByCash: 0,
  paidByCard: 0,
  deductAmount: false,
  cashTenderReceivedAmount: 0,
  cashTenderReceivedAmountTxCommited: false,
  cashTenderTenderedAmount: 0,
  cashTenderTenderedAmountTxCommited: false,
  isRepayMode: false,
  txStatus: "" as TxStatus,
});
