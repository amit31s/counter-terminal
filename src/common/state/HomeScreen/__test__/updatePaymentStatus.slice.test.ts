import { CashTender } from "@ct/interfaces/basket.interface";
import { IPaymentDispatchPayload } from "@ct/interfaces/HomeInterface";
import { defaultPaymentStatusData } from "../../initialStateData";
import reducer, {
  resetPaymentStatus,
  setRepayModeStatus,
  updateCardPayment,
  updateCashPayment,
  UpdatePaymentInitialStatus,
  updatePaymentStatus,
} from "../updatePaymentStatus.slice";

const mockInitialState: UpdatePaymentInitialStatus = defaultPaymentStatusData();

const mockUpdatedState: UpdatePaymentInitialStatus & CashTender & IPaymentDispatchPayload = {
  time: 0,
  completed: true,
  paidByCash: 5,
  paidByCard: 10,
  deductAmount: true,
  cashTenderTenderedAmount: 5,
  cashTenderReceivedAmount: 10,
  cashTenderReceivedAmountTxCommited: true,
  cashTenderTenderedAmountTxCommited: true,
  isRepayMode: true,
  txStatus: "",
};

describe("render updatePaymentStatus slice", () => {
  test("test updatePaymentStatus", () => {
    const updateAction = updatePaymentStatus(mockUpdatedState);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.deductAmount).toBe(true);
  });

  test("test updateCashPayment", () => {
    const updateAction = updateCashPayment(10);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.paidByCash).toBe(10);
  });

  test("test updateCardPayment", () => {
    const updateAction = updateCardPayment(10);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.paidByCard).toBe(10);
  });

  test("test setRepayModeStatus", () => {
    const updateAction = setRepayModeStatus(true);
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.isRepayMode).toBe(true);
  });

  test("test resetPaymentStatus", () => {
    const updateAction = resetPaymentStatus();
    const updateResult = reducer(mockInitialState, updateAction);
    expect(updateResult.completed).toBe(false);
    expect(updateResult.paidByCash).toBe(0);
    expect(updateResult.paidByCard).toBe(0);
  });
});
