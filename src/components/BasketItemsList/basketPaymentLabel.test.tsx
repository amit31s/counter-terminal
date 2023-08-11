import { renderWithRedux } from "@ct/common/helpers/test-utils";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { TEXT } from "@ct/constants";
import { BasketPaymentLabel } from "./basketPaymentLabel";

describe("BasketItemsList", () => {
  it("doesn't show when basket is balanced", async () => {
    const { queryByTestId } = renderWithRedux(<BasketPaymentLabel />, {
      updatePaymentStatus: {
        time: 0,
        completed: true,
        paidByCash: 0,
        paidByCard: 0,
        deductAmount: false,
        cashTenderReceivedAmount: 0,
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmount: 0,
        cashTenderTenderedAmountTxCommited: false,
        isRepayMode: false,
        txStatus: "",
      },
    });

    expect(queryByTestId("BasketPaymentLabel")).toBeFalsy();
  });

  it("doesn't show when basket is positive", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.customerToPay = 20;
    updateBasket.basketValue = 20;
    const { queryByTestId } = renderWithRedux(<BasketPaymentLabel />, {
      updateBasket,
      updatePaymentStatus: {
        time: 0,
        completed: true,
        paidByCash: 0,
        paidByCard: 0,
        deductAmount: false,
        cashTenderReceivedAmount: 0,
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmount: 0,
        cashTenderTenderedAmountTxCommited: false,
        isRepayMode: false,
        txStatus: "",
      },
    });

    expect(queryByTestId("BasketPaymentLabel")).toBeFalsy();
  });

  it("shows when basket is negative", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.postOfficeTenderingAmount = -20;
    updateBasket.basketValue = -20;
    const { getByTestId, getByText } = renderWithRedux(<BasketPaymentLabel />, {
      updateBasket,
      updatePaymentStatus: {
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
        txStatus: "",
      },
    });

    expect(getByTestId("BasketPaymentLabel")).toBeTruthy();
    expect(getByText("£20.00")).toBeTruthy();
  });

  it("Should shows customer to pay amount correctly", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.customerToPay = 1;
    updateBasket.basketValue = 1;
    updateBasket.items = [
      {
        id: "1",
        total: 1,
        quantity: 1,
        price: 1,
        commitStatus: CommitStatus.success,
        fulFillmentStatus: "notRequired",
        source: "local",
        additionalItemsValue: 0,
      },
    ];
    const { getByTestId, getByText } = renderWithRedux(<BasketPaymentLabel />, {
      updateBasket,
    });

    expect(getByTestId("BasketPaymentLabel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00018)).toBeTruthy();
    expect(getByText("£1.00")).toBeTruthy();
  });

  it("Should show Post Office to Pay when change is due after payment", () => {
    const updateBasket = defaultBasketData();
    updateBasket.customerToPay = -10;
    updateBasket.basketValue = -10;
    const { getByTestId, getByText } = renderWithRedux(<BasketPaymentLabel />, {
      updatePaymentStatus: {
        time: 0,
        completed: false,
        paidByCash: -20,
        paidByCard: 0,
        deductAmount: false,
        cashTenderReceivedAmount: 0,
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmount: 0,
        cashTenderTenderedAmountTxCommited: false,
        isRepayMode: false,
        txStatus: "",
      },
      updateBasket,
    });

    expect(getByTestId("BasketPaymentLabel")).toBeTruthy();
    expect(getByText(TEXT.CTTXT00019)).toBeTruthy();
    expect(getByText("£10.00")).toBeTruthy();
  });

  it("Should not show customer to Pay or Post Office to Pay when the basket is balanced", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.customerToPay = 1;
    updateBasket.basketValue = 1;
    updateBasket.items = [
      {
        id: "1",
        total: 1,
        quantity: 1,
        price: 1,
        commitStatus: CommitStatus.success,
        fulFillmentStatus: "notRequired",
        source: "local",
        additionalItemsValue: 0,
      },
    ];
    const { queryByTestId } = renderWithRedux(<BasketPaymentLabel />, {
      updatePaymentStatus: {
        time: 0,
        completed: true,
        paidByCash: 1,
        paidByCard: 0,
        deductAmount: false,
        cashTenderReceivedAmount: 0,
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmount: 0,
        cashTenderTenderedAmountTxCommited: false,
        isRepayMode: false,
        txStatus: "",
      },
      updateBasket,
    });

    expect(queryByTestId("BasketPaymentLabel")).toBeFalsy();
  });
});
