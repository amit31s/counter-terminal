import {
  RootState,
  renderWithRedux,
  renderWithReduxAndStore,
  setupUser,
  waitFor,
} from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData, defaultPaymentStatusData } from "@ct/common/state/initialStateData";
import { LoadingId } from "@ct/common/state/loadingStatus.slice";
import { BUTTON, STATE_CONSTANTS, TEXT, stringConstants } from "@ct/constants";
import { QuickTendering } from "@ct/features/HomeScreenFeature/HomeScreenLeftPanel/QuickTendering";
import { appendPoundSymbolWithAmount } from "@ct/utils";
import { cloneDeep } from "lodash";

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

const defaultTestReduxState = (): Pick<
  RootState,
  "updateBasket" | "updatePaymentStatus" | "updateBasketIdStatus"
> => ({
  updateBasket: cloneDeep(updateBasketMock),
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

const mGetProduct = jest.fn();
jest.mock("postoffice-product-journey-api-clients", () => {
  const apiClients = jest.requireActual("postoffice-product-journey-api-clients");
  apiClients.enablerAPIClientFactory.buildClient = jest.fn().mockReturnValue({
    getProduct: () => mGetProduct(),
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

describe("quick tendering", () => {
  beforeAll(() => {
    mGetProduct.mockClear();
    mGetProduct.mockReturnValue({
      mediumName: "mediumName",
      itemType: "itemType",
      existingReversalAllowed: "existingReversalAllowed",
    });
  });

  it("renders anything", () => {
    const testReduxState = defaultTestReduxState();
    const { getByTestId } = renderWithRedux(<QuickTendering />, testReduxState);
    expect(getByTestId("QuickTenderingView")).toBeTruthy();
  });

  it("should disable quick tendering options when payment is done", async () => {
    const initialBasketState = defaultBasketData();
    const initialPaymentStatusState = defaultPaymentStatusData();
    initialPaymentStatusState.paidByCash = 100;
    initialBasketState.customerToPay = 100;
    initialBasketState.basketValue = 0;

    const { getByTestId } = renderWithRedux(<QuickTendering />, {
      updateBasket: initialBasketState,
      updatePaymentStatus: initialPaymentStatusState,
    });

    expect(getByTestId("QuickTenderingBtn0")).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId("QuickTenderingBtn1")).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId("QuickTenderingBtn2")).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId("QuickTenderingBtn3")).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId(BUTTON.CTBTN0013)).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId(BUTTON.CTBTN0010)).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId(BUTTON.CTBTN0017)).toHaveAttribute("aria-disabled", "true");
    expect(getByTestId(BUTTON.CTBTN0018)).toHaveAttribute("aria-disabled", "true");
  });

  it("handles full cash payments", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    if (testReduxState.updatePaymentStatus?.txStatus) {
      testReduxState.updatePaymentStatus.txStatus = "completed";
    }
    const {
      store,
      rendered: { getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    expect(getByTestId("QuickTenderingBtn0")).toBeTruthy();

    await user.click(getByTestId("QuickTenderingBtn0"));

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("handles custom cash payments", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    if (testReduxState.updatePaymentStatus?.txStatus) {
      testReduxState.updatePaymentStatus.txStatus = "completed";
    }
    const {
      store,
      rendered: { getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    const cashButton = getByTestId(BUTTON.CTBTN0013);
    expect(cashButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");
    expect(currencyInput).toBeTruthy();

    await user.clear(currencyInput);
    await user.type(currencyInput, "1000");
    expect(currencyInput).toHaveDisplayValue("10.00");

    await user.click(cashButton);

    await user.clear(currencyInput);
    await user.type(currencyInput, "2000");
    expect(currencyInput).toHaveDisplayValue("20.00");

    await user.click(cashButton);

    await user.clear(currencyInput);
    await user.type(currencyInput, "6000");
    expect(currencyInput).toHaveDisplayValue("60.00");

    await user.click(cashButton);

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("handles empty custom cash payment", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    const {
      store,
      rendered: { getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    const cashButton = getByTestId(BUTTON.CTBTN0013);
    expect(cashButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");
    expect(currencyInput).toBeTruthy();

    await user.clear(currencyInput);
    await user.type(currencyInput, "0");
    expect(currencyInput).toHaveDisplayValue("0.00");

    await user.click(cashButton);

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("handles multiple predifined cash payments", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    const {
      store,
      rendered: { getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    await user.click(getByTestId("QuickTenderingBtn1"));
    await user.click(getByTestId("QuickTenderingBtn1"));
    await user.click(getByTestId("QuickTenderingBtn2"));
    await user.click(getByTestId("QuickTenderingBtn3"));
    await user.click(getByTestId("QuickTenderingBtn3"));

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("handles quick card payment", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    const { getByTestId } = renderWithRedux(<QuickTendering />, testReduxState);

    const cardButton = getByTestId("Card");
    expect(cardButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");
    expect(currencyInput).toBeTruthy();

    await user.clear(currencyInput);
    await user.type(currencyInput, "0");
    expect(currencyInput).toHaveDisplayValue("0.00");

    await user.click(cardButton);
  });

  it("Test cheque button is disabled", async () => {
    const testReduxState = defaultTestReduxState();
    const { getByTestId } = renderWithRedux(<QuickTendering />, testReduxState);
    const chequedButton = getByTestId(BUTTON.CTBTN0017);
    expect(chequedButton).toBeEnabled();
  });

  it("handles overpaying in quick card payment", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    const { getByTestId, getByText, queryByText } = renderWithRedux(
      <QuickTendering />,
      testReduxState,
    );

    const cardButton = getByTestId("Card");
    expect(cardButton).toBeTruthy();

    const currencyInput = getByTestId("currency-field");
    expect(currencyInput).toBeTruthy();

    await user.clear(currencyInput);
    await user.type(currencyInput, "10000");
    expect(currencyInput).toHaveDisplayValue("100.00");

    await user.click(cardButton);

    expect(
      getByText(
        stringConstants.transactionalMessages.cardLimitMessage(appendPoundSymbolWithAmount(60)),
      ),
    ).toBeTruthy();

    await user.clear(currencyInput);
    await user.type(currencyInput, "6000");
    expect(currencyInput).toHaveDisplayValue("60.00");

    await user.click(cardButton);

    expect(
      queryByText(
        stringConstants.transactionalMessages.cardLimitMessage(appendPoundSymbolWithAmount(60)),
      ),
    ).toBeFalsy();
  });

  it("handles quick cash payment. Show receipt modal on click of cash when tx completed", async () => {
    const user = setupUser();

    const testReduxState = defaultTestReduxState();
    const {
      store,
      rendered: { getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    const button = getByTestId(BUTTON.CTBTN0013);
    expect(button).toBeTruthy();
    await user.click(button);

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("disables card button when cash only item is in the basket", async () => {
    const testReduxState = defaultTestReduxState();
    testReduxState.updateBasket?.items.push({
      name: "Test Item 1",
      id: "1",
      commitStatus: CommitStatus.notInitiated,
      fulFillmentStatus: "fulfillmentNotInitiated",
      price: 10,
      total: 10,
      item: ["Test Item 1"],
      quantity: 0,
      source: "nbit",
      journeyData: { transaction: { tokens: { methodOfPayment: "cash" } } },
      additionalItemsValue: 0,
    });
    const { getByTestId } = renderWithRedux(<QuickTendering />, testReduxState);

    const button = getByTestId(BUTTON.CTBTN0010);
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("allows you to make an IRC payment", async () => {
    mGetProduct.mockReturnValue({
      mediumName: "mediumName",
      itemType: "itemType",
      existingReversalAllowed: "existingReversalAllowed",
      minimumValue: 0.01,
      maximumValue: 11.0,
    });
    const testReduxState = defaultTestReduxState();
    testReduxState.updateBasket.items = [
      {
        name: "Test Item 1",
        id: "Test Item 1",
        commitStatus: CommitStatus.notInitiated,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 5,
        total: 5,
        item: ["Test Item 1"],
        quantity: 1,
        source: "local",
        additionalItemsValue: 0,
        journeyData: { transaction: { uniqueID: "Test Item 1", entryType: "mails" } },
      },
    ];
    testReduxState.updateBasket.customerToPay = 5;
    testReduxState.updateBasket.basketValue = 5;
    const user = setupUser();
    const {
      store,
      rendered: { getByRole, getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    await user.type(getByRole("textbox"), "500");

    const button = getByTestId(BUTTON.CTBTN0018);
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute("aria-disabled", "true");
    await user.click(button);

    await waitFor(() => {
      expect(getByTestId(stringConstants.Button.BTN_NO)).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(getByTestId(stringConstants.Button.BTN_NO));

    expect(store.getState().updateHomeScreenStage.stage).toBe(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("shows a warning when making an IRC payment over the limit", async () => {
    mGetProduct.mockReturnValue({
      mediumName: "mediumName",
      itemType: "itemType",
      existingReversalAllowed: "existingReversalAllowed",
      minimumValue: 0.01,
      maximumValue: 11.0,
    });
    const testReduxState = defaultTestReduxState();
    testReduxState.updateBasket.items = [
      {
        name: "Test Item 1",
        id: "Test Item 1",
        commitStatus: CommitStatus.notInitiated,
        fulFillmentStatus: "fulfillmentNotInitiated",
        price: 20,
        total: 20,
        item: ["Test Item 1"],
        quantity: 1,
        source: "local",
        additionalItemsValue: 0,
        journeyData: { transaction: { uniqueID: "Test Item 1", entryType: "mails" } },
      },
    ];
    testReduxState.updateBasket.customerToPay = 20;
    testReduxState.updateBasket.basketValue = 20;
    const user = setupUser();
    const {
      store,
      rendered: { getByRole, getByTestId },
    } = renderWithReduxAndStore(<QuickTendering />, testReduxState);

    await user.type(getByRole("textbox"), "2000");

    const button = getByTestId(BUTTON.CTBTN0018);
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute("aria-disabled", "true");
    await user.click(button);

    expect(store.getState().loadingStatus[0].id).toBe(LoadingId.IRC_INVALID_AMOUNT);
    expect(store.getState().loadingStatus[0].modalProps.content).toBe(
      TEXT.CTTXT00081("£0.01", "£11.00"),
    );
  });
});
