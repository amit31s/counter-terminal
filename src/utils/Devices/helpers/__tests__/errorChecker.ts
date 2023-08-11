import { PedActions } from "postoffice-peripheral-management-service";
import { errorChecker } from "../errorChecker";

describe("errorChecker", () => {
  it("throws correct error for non permited actions", () => {
    const transactionId = "123456";
    const action = PedActions.RefundX;
    const amount = 5;
    const event = "12345";
    expect(() => {
      errorChecker(transactionId, action, amount, event);
    }).toThrow("Action REFUND_X is not supported within a journey");
  });

  it("throws correct error for no transaction ID", () => {
    const transactionId = "";
    const action = PedActions.WithdrawalX;
    const amount = 5;
    const event = "12345";
    expect(() => {
      errorChecker(transactionId, action, amount, event);
    }).toThrow("transactionId is a mandatory param");
  });

  it("throws correct error for zero amount", () => {
    const transactionId = "123456";
    const action = PedActions.WithdrawalX;
    const amount = 0;
    const event = "12345";
    expect(() => {
      errorChecker(transactionId, action, amount, event);
    }).toThrow("amount is a mandatory param for WITHDRAWAL_X");
  });

  it("throws correct error for no event", () => {
    const transactionId = "123456";
    const action = PedActions.POSEvent;
    const amount = 5;
    const event = "";
    expect(() => {
      errorChecker(transactionId, action, amount, event);
    }).toThrow("event is a mandatory param for POS_EVENT");
  });
});
