import { renderHookWithReduxAndStore, waitFor } from "@ct/common/helpers";
import { useFulfilmentActions } from "../useFulfilmentActions";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { FulfillmentStatusEnum } from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import * as useGetBasketItemToCommitHook from "@ct/common/hooks/homeScreenHooks/useGetBasketItemToCommit";
import { FallBackModeFlagEnum, RefundFlagEnum } from "postoffice-commit-and-fulfill";
import { STATE_CONSTANTS } from "@ct/constants";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";

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
  {
    name: "First Trust Bank",
    id: "Cash Deposit",
    item: "First Trust Bank",
    total: 10,
    voidable: true,
    journeyData: {
      basket: {
        id: "First Trust Bank",
      },
      transaction: {
        cashTenderTendered: "true",
        commitAndFulfillPoint: "immediate",
        entryType: "banking",
        itemID: "42393",
        quantity: "1",
        quantityFixed: "false",
        receiptLine: "1",
        tokens: {
          agentSlaInfo: " ",
          amountRequested: "1000",
          authorisation_code: " ",
          bankResponse: " ",
          bankTransactionID: " ",
          bankValueFlag: " ",
          cardImpounded: " ",
          cashTenderMessage:
            "Have you taken the cash for the cash deposit and placed it in the cash drawer?",
          clientID: "559",
          counterSlaInfo: " ",
          currency: "GBP",
          fee: "0",
          financialTransaction: " ",
          fulfilmentAction: "deposit",
          fulfilmentType: "PED",
          horizonTransactionID: "71V9BK000109",
          issuerSchemeID: "156",
          merchantNumber: " ",
          methodOfPayment: "cash",
          pan: "4544348000000000",
          paymentId: "123456789",
          receiptDate: "20230713",
          receiptItemName: "First Trust Bank",
          recoveryFlag: "N",
          responseCode: "WILL_COME_FROM_FULFILLMENT",
          routingGateway: " ",
          settlementDate: "20230713",
          skipPin: "true",
          transactionResultCode: "WILL_COME_FROM_FULFILLMENT",
          transactionType: "82",
          productDescription: "First Trust Bank",
          itemType: "Cash Deposit",
        },
        transactionStartTime: 1689238090294,
        valueInPence: "1000",
        voidable: "true",
        uniqueID: "Cash Deposit",
        itemDescription: "First Trust Bank",
        stockunitIdentifier: "C10",
      },
    },
    commitStatus: "notInitiated",
    fulFillmentStatus: "fulfillmentNotInitiated",
    quantity: 1,
    source: "local",
    price: 10,
    additionalItemsValue: 0,
    stockunitIdentifier: "C10",
  },
] as IbasketItem[];

const mockCashItem = [
  {
    quantity: -1,
    entryID: 2,
    valueInPence: -100,
    transactionStartTime: new Date().getTime(),
    itemID: 1,
    additionalItems: [],
    stockunitIdentifier: "",
    methodOfDataCapture: 1,
    refundFlag: RefundFlagEnum.N,
    fallBackModeFlag: FallBackModeFlagEnum.N,
    uniqueID: STATE_CONSTANTS.CASH_TENDER_RECEIVED_AMOUNT,
    tokens: {
      entryID: "2",
    },
  },
];

describe("useFulfilmentActions", () => {
  it("test useFulfilmentActions without cashTenderTendered", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [mockItem[0]];
    const { store } = renderHookWithReduxAndStore(
      async () => {
        useFulfilmentActions();
      },
      {
        updateBasket,
        updateFulfillment: {
          fulfillmentRequired: true,
          deviceId: "",
          item: [{ ...mockItem[0], fulfillmentStatus: FulfillmentStatusEnum.SUCCESS }],
          fulfillmentStatus: FulfillmentStatusEnum.SUCCESS,
        },
      },
    );
    await waitFor(() => {
      const basketData = store.getState().updateBasket;
      expect(basketData.items.length).toBe(1);
    });
  });
  it("test useFulfilmentActions with cashTenderTendered", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn(),
        getAggregatedItemsToCommit: jest.fn(),
        getTenderAmountToCommit: jest.fn().mockResolvedValue(mockCashItem),
        getNumberOfEntries: jest.fn().mockReturnValue(1),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const updateBasket = defaultBasketData();
    updateBasket.items = [mockItem[1]];
    const { store } = renderHookWithReduxAndStore(
      async () => {
        useFulfilmentActions("YES");
      },
      {
        updateBasket,
        updateFulfillment: {
          fulfillmentRequired: true,
          deviceId: "",
          item: [{ ...mockItem[1], fulfillmentStatus: FulfillmentStatusEnum.SUCCESS }],
          fulfillmentStatus: FulfillmentStatusEnum.SUCCESS,
        },
      },
    );
    await waitFor(() => {
      const basketData = store.getState().updateBasket;
      expect(basketData.items.length).toBe(2);
    });
  });
});
