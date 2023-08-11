import { renderWithRedux, RootState, setupUser } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { stringConstants } from "@ct/constants";
import { RefundScreen } from ".";

const updateBasketMock = defaultBasketData();
updateBasketMock.items = [
  {
    name: "Test Item 1",
    id: "Test Item 1",
    commitStatus: CommitStatus.notInitiated,
    fulFillmentStatus: "fulfillmentNotInitiated",
    price: 10,
    total: 10,
    item: ["Test Item 1"],
    quantity: 0,
    source: "local",
    additionalItemsValue: 0,
    journeyData: { transaction: { uniqueID: "Test Item 1" } },
  },
  {
    name: "Test Item 2",
    id: "Test Item 2",
    commitStatus: CommitStatus.notInitiated,
    fulFillmentStatus: "fulfillmentNotInitiated",
    price: 20,
    total: 20,
    item: ["Test Item 2"],
    quantity: 0,
    source: "local",
    additionalItemsValue: 0,
    journeyData: { transaction: { uniqueID: "Test Item 2" } },
  },
  {
    name: "Test Item 3",
    id: "Test Item 3",
    commitStatus: CommitStatus.notInitiated,
    fulFillmentStatus: "fulfillmentNotInitiated",
    price: 30,
    total: 30,
    item: ["Test Item 3"],
    quantity: 0,
    source: "local",
    additionalItemsValue: 0,
    journeyData: { transaction: { uniqueID: "Test Item 3" } },
  },
];
updateBasketMock.customerToPay = 60;
updateBasketMock.basketValue = 60;

const defaultTestReduxState = (): Partial<RootState> => ({
  updateBasket: updateBasketMock,
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
  updateBasketIdStatus: {
    basketId: "",
    isBasketOpened: false,
    time: 0,
    closeBasketFailed: false,
    basketClosed: false,
    errorCode: "",
  },
});

jest.mock("postoffice-product-journey-api-clients", () => {
  const apiClients = jest.requireActual("postoffice-product-journey-api-clients");
  apiClients.enablerAPIClientFactory.buildClient = jest.fn().mockReturnValue({
    getProduct: jest.fn().mockReturnValue({
      mediumName: "mediumName",
      itemType: "itemType",
      existingReversalAllowed: "existingReversalAllowed",
    }),
  });

  return apiClients;
});

jest.mock("@ct/utils", () => {
  const utils = jest.requireActual("@ct/utils");
  utils.transactionApiClient = jest.fn().mockReturnValue({
    createBasket: jest.fn(),
    getBasket: jest.fn(),
    getLastSeqNumber: jest.fn(),
    lastBasketID: jest.fn(),
    closeBasket: jest.fn(),
    getBasketId: jest.fn(),
    getLastBasket: jest.fn().mockReturnValue({
      data: {
        basket: { basketCore: { basketID: "basketId", basketState: "BKO", NumberOfEntries: 4 } },
      },
    }),
    getNumberOfEntries: jest.fn().mockReturnValue(0),
    client: {
      createBasketEntry: jest.fn().mockReturnValue({ data: { fulfilmentRequired: false } }),
    },
  });
  return utils;
});

jest.mock("@ct/utils/Services/auth", () => ({
  getUserIdToken: jest.fn().mockReturnValue("id token"),
  getUserName: jest.fn().mockReturnValue("username"),
}));

describe("refund screen", () => {
  it("renders anything", () => {
    const { getByTestId } = renderWithRedux(<RefundScreen />, defaultTestReduxState());
    expect(getByTestId("refundView")).toBeTruthy();
  });

  it("handles custom cash payments", async () => {
    const user = setupUser();

    const { getByTestId } = renderWithRedux(<RefundScreen />, defaultTestReduxState());

    const cashButton = getByTestId(stringConstants.RefundScreen.CashBtnTxtTestId);
    expect(cashButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");

    await user.type(currencyInput, "6000");
    expect(currencyInput).toHaveDisplayValue("60.00");

    await user.click(cashButton);
  });

  it("handles empty custom cash payment", async () => {
    const user = setupUser();

    const { getByTestId } = renderWithRedux(<RefundScreen />, defaultTestReduxState());

    const cashButton = getByTestId(stringConstants.RefundScreen.CashBtnTxtTestId);
    expect(cashButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");

    await user.type(currencyInput, "0");
    expect(currencyInput).toHaveDisplayValue("0.00");

    await user.click(cashButton);
  });

  it("handles quick card payment", async () => {
    const user = setupUser();

    const { getByTestId } = renderWithRedux(<RefundScreen />, defaultTestReduxState());

    const cardButton = getByTestId(stringConstants.RefundScreen.CardBtnTxtTestId);
    expect(cardButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");

    await user.type(currencyInput, "0");
    expect(currencyInput).toHaveDisplayValue("0.00");

    await user.click(cardButton);
  });

  it("Test cheque button is disabled", async () => {
    const { getByTestId } = renderWithRedux(<RefundScreen />, defaultTestReduxState());
    const chequedButton = getByTestId(stringConstants.RefundScreen.ChequeBtnTxtTestId);
    expect(chequedButton).toHaveAttribute("aria-disabled", "true");
  });
});
