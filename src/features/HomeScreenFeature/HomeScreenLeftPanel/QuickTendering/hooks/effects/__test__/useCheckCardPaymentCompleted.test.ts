import { renderHookWithRedux } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { FulfillmentStatusEnum } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { IbasketItem } from "postoffice-prepare-receipt-context/dist/mails/types";
import React from "react";
import { useCheckCardPaymentCompleted } from "../useCheckCardPaymentCompleted";
const mockItem = [
  {
    name: "Balance Enquiry Test",
    id: "Cash Withdrawal",
    item: ["Balance Enquiry Test"],
    quantity: 1,
    total: 1,
    voidable: true,
    journeyData: {
      basket: { id: "Balance Enquiry Test" },
      transaction: {
        commitAndFulfillPoint: "aggregated",
        entryID: 1,
        itemID: "50211",
        quantity: 1,
        quantityFixed: "true",
        receiptLine: "1",
        tokens: {
          currency: "GBP",
          entryID: "1",
        },
        transactionStartTime: 1661783875553,
        valueInPence: 100,
        voidable: "true",
        uniqueID: "Cash Withdrawal",
        cashTenderTendered: "true",
        journeyType: JOURNEYENUM.CASH_WITHDRAWAL,
      },
    },
    commitStatus: CommitStatus.success,
    price: 1,
    source: "local",
    additionalItemsValue: 0,
    fulFillmentStatus: "success",
  },
] as unknown as IbasketItem[];
describe("Testing useCheckCardPaymentCompleted hook", () => {
  const setStateMock = jest.fn();
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  test("reset useCheckCardPaymentCompleted without fulfilment", () => {
    const { result } = renderHookWithRedux(() =>
      useCheckCardPaymentCompleted("test", setStateMock),
    );
    expect(result).toBeTruthy();
  });

  test("reset useCheckCardPaymentCompleted with null paymentUUID", () => {
    const { result } = renderHookWithRedux(() => useCheckCardPaymentCompleted(null, setStateMock));
    expect(result).toBeTruthy();
  });

  test("reset useCheckCardPaymentCompleted with fulfilment", () => {
    const { result } = renderHookWithRedux(
      () => useCheckCardPaymentCompleted("Cash Withdrawal", setStateMock),
      {
        updateFulfillment: {
          fulfillmentRequired: true,
          deviceId: "",
          item: [{ ...mockItem[0], fulfillmentStatus: FulfillmentStatusEnum.SUCCESS }],
          fulfillmentStatus: FulfillmentStatusEnum.SUCCESS,
        },
      },
    );
    expect(result).toBeTruthy();
  });

  test("reset useCheckCardPaymentCompleted with Failed fulfilment status", () => {
    const { result } = renderHookWithRedux(
      () => useCheckCardPaymentCompleted("Cash Withdrawal", setStateMock),
      {
        updateFulfillment: {
          fulfillmentRequired: true,
          deviceId: "",
          item: [{ ...mockItem[0], fulfillmentStatus: FulfillmentStatusEnum.FAILED }],
          fulfillmentStatus: FulfillmentStatusEnum.FAILED,
        },
      },
    );
    expect(result).toBeTruthy();
  });
});
