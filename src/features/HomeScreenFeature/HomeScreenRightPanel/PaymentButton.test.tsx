import { renderWithRedux, renderWithReduxAndStore, setupUser } from "@ct/common";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { BUTTON, STATE_CONSTANTS, stringConstants } from "@ct/constants";
import { basketItemMock, basketItemMockForRefund } from "@ct/utils/MockData";
import * as TransactionAPI from "@ct/utils/Services/CommitFulfillService/transactionApi";
import { BasketStateEnum } from "postoffice-commit-and-fulfill";
import { PaymentButton } from "./PaymentButton";

jest.spyOn(TransactionAPI, "transactionApiClient").mockReturnValue({
  getLastBasket: async () => ({
    data: {
      basket: {
        basketCore: {
          basketID: "mock-basket-id",
          basketState: BasketStateEnum.Bkc,
          NumberOfEntries: 0,
        },
      },
      entries: [],
    },
  }),
  createBasket: jest.fn(),
  getBasket: jest.fn(),
  getLastSeqNumber: jest.fn(),
  lastBasketID: jest.fn(),
  closeBasket: jest.fn(),
  getBasketId: jest.fn(),
  getNumberOfEntries: jest.fn(),
  client: {
    closeOrModifyBasket: jest.fn(),
    createBasket: jest.fn(),
    createBasketEntry: jest.fn(),
    getBasket: jest.fn(),
    getBasketEntry: jest.fn(),
    getLastBasket: jest.fn(),
    getLastSeqNumber: jest.fn(),
    updateBasketEntryFulfilment: jest.fn(),
    getBasketEntryReversal: jest.fn(),
  },
});

describe("Testing PaymentButton, Complete and finish button", () => {
  it("Complete button should be disabled when items length is zero", async () => {
    const updateBasket = defaultBasketData();
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const completeBtn = getByTestId(stringConstants.Button.Complete);
    expect(completeBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("Complete button should be enabled after adding items to basket", async () => {
    const user = setupUser();
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;

    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const completeBtn = getByTestId(stringConstants.Button.Complete);
    expect(completeBtn).not.toHaveAttribute("aria-disabled", "true");
    await user.click(completeBtn);
  });

  it("Should show payment button when customer needs to pay", async () => {
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 10;
    updateBasket.basketValue = 10;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const paymentBtn = getByTestId(BUTTON.CTBTN0001);
    expect(paymentBtn).not.toHaveAttribute("aria-disabled", "true");
  });

  it("Refund button should visible and enable if customer Request to Refund ", async () => {
    const items = basketItemMockForRefund();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.postOfficeToPay = 10;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const refundBtn = getByTestId(BUTTON.CTBTN0007);
    expect(refundBtn).not.toHaveAttribute("aria-disabled", "true");
  });

  it("Should show repay button when Post master needs to pay", () => {
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.postOfficeTenderingAmount = -10;
    updateBasket.basketValue = -10;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const btn = getByTestId(BUTTON.CTBTN0009);
    expect(btn).not.toHaveAttribute("aria-disabled", "true");
  });

  it("repay button should not visible if customer need to pay", async () => {
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 10;
    const { queryByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    expect(queryByTestId(BUTTON.CTBTN0009)).toBeFalsy();
  });

  it("Finish button should enabled on complete when all items has committed", async () => {
    const user = setupUser();
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 10;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_COMPLETED,
        completeClicked: true,
        time: 123,
      },
      updateBasketIdStatus: {
        basketId: "Mock-Basket-Id",
        isBasketOpened: false,
        time: 0,
        closeBasketFailed: false,
        basketClosed: false,
        errorCode: "",
      },
      updatePaymentStatus: {
        time: 0,
        completed: true,
        paidByCash: 12,
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

    const finishbtn = getByTestId(BUTTON.CTBTN0002);

    expect(finishbtn).not.toHaveAttribute("aria-disabled", "true");
    await user.click(finishbtn);

    expect(finishbtn).toHaveAttribute("aria-disabled", "true");

    const completeBtn = getByTestId(stringConstants.Button.Complete);
    expect(completeBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("Should proceed to the sales screen after 3 seconds of transaction", async () => {
    const user = setupUser();
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    for (let index = 0; index < items.length; index++) {
      items[index].total = 0;
      items[index].price = 0;
    }
    updateBasket.items = items;
    const {
      rendered: { getByTestId, getByRole },
      store,
    } = renderWithReduxAndStore(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
      updateHomeScreenStage: {
        stage: STATE_CONSTANTS.STAGE_HOME,
        completeClicked: true,
        time: 123,
      },
    });

    const completeBtn = getByTestId(BUTTON.CTBTN0003);
    expect(completeBtn).toBeTruthy();
    await user.click(completeBtn);
    const noButton = getByRole("button", { name: "No" });
    expect(noButton).toBeInTheDocument();
    await user.click(noButton);
    expect(store.getState().updateHomeScreenStage.stage).toEqual(STATE_CONSTANTS.STAGE_COMPLETED);
  });

  it("Complete button should be display when remaining balance is zero", async () => {
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 10;
    updateBasket.postOfficeTenderingAmount = 10;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const completeBtn = getByTestId(stringConstants.Button.Complete);
    expect(completeBtn).not.toHaveAttribute("aria-disabled", "true");
  });

  it("Repay button should be display when remaining balance is greater than zero", async () => {
    const items = basketItemMock();
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 5;
    updateBasket.postOfficeTenderingAmount = -10;
    updateBasket.basketValue = -5;
    const { getByTestId } = renderWithRedux(<PaymentButton />, {
      updateBasket,
      updateJourneyStatus: {
        open: true,
        event: undefined,
      },
    });
    const btn = getByTestId(BUTTON.CTBTN0009);
    expect(btn).not.toHaveAttribute("aria-disabled", "true");
  });
});
