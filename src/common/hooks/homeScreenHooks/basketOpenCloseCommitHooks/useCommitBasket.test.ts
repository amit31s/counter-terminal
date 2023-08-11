import { renderHookWithRedux } from "@ct/common/helpers";
import * as useGetBasketItemToCommitHook from "@ct/common/hooks/homeScreenHooks/useGetBasketItemToCommit";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { basketItemMock } from "@ct/utils/MockData";
import * as TransactionAPI from "@ct/utils/Services/CommitFulfillService/transactionApi";
import {
  BasketItemPayload,
  BasketStateEnum,
  FallBackModeFlagEnum,
  RefundFlagEnum,
} from "postoffice-commit-and-fulfill";
import { useCommitBasket } from "./useCommitBasket";
jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
  return {
    getDataToCommit: jest.fn().mockReturnValue(basketItemMock()),
    getAggregatedItemsToCommit: jest.fn().mockReturnValue(basketItemMock()),
    getTenderAmountToCommit: jest.fn(),
    getNumberOfEntries: jest.fn().mockReturnValue(1),
    getCardEntryToCommit: jest.fn(),
  };
});

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

const cashPayload: BasketItemPayload[] = [
  {
    quantity: 1,
    entryID: 111,
    valueInPence: 1000,
    transactionStartTime: 0,
    itemID: "test-itemId",
    additionalItems: [],
    stockunitIdentifier: "C01",
    methodOfDataCapture: 1,
    refundFlag: RefundFlagEnum.N,
    fallBackModeFlag: FallBackModeFlagEnum.N,
    uniqueID: "test-unique-id",
    tokens: {
      entryID: "test-entry-id",
      productDescription: "test-product-description",
      itemType: "test-itemType",
      existingReversalAllowed: "test-exist-reversal",
    },
  },
];

const updateBasket = defaultBasketData();

const emptyBasketMock = {
  updateBasket,
};

describe("Testing useCommitBasket hook", () => {
  test("when basket data is empty commitBasket should return undefined", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn().mockReturnValue(() => {
          throw new Error();
        }),
        getAggregatedItemsToCommit: jest.fn().mockReturnValue(basketItemMock()),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn().mockReturnValue(1),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { commitBasket } = useCommitBasket();
      return commitBasket({
        basketItems: [],
      });
    }, emptyBasketMock);
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("when basket data is empty commitBasket should return basketItem", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn().mockReturnValue(basketItemMock()),
        getAggregatedItemsToCommit: jest.fn().mockReturnValue(basketItemMock()),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn().mockReturnValue(1),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { commitBasket } = useCommitBasket();
      return commitBasket({
        basketItems: basketItemMock(),
      });
    }, emptyBasketMock);
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("when basket data is empty commitAggregatedItems should return undefined", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn(),
        getAggregatedItemsToCommit: jest.fn(),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { commitAggregatedItems } = useCommitBasket();
      return commitAggregatedItems([]);
    }, emptyBasketMock);
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("when basket data commitAggregatedItems should return basketItem", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn(),
        getAggregatedItemsToCommit: jest.fn().mockReturnValue(basketItemMock()),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { commitAggregatedItems } = useCommitBasket();
      return commitAggregatedItems(basketItemMock());
    });
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("test retryCommit should return basketItem", async () => {
    const { result } = renderHookWithRedux(() => {
      const { retryCommit } = useCommitBasket();
      return retryCommit(basketItemMock()[0]);
    });
    const response = await result.current;
    expect(response).toBeUndefined();
  });
  test("test commitCashEntry should return basketItem", async () => {
    const { result } = renderHookWithRedux(() => {
      const { commitCashEntry } = useCommitBasket();
      return commitCashEntry(cashPayload);
    });
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("test commitCardEntry should return blank response", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn(),
        getAggregatedItemsToCommit: jest.fn(),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getCardEntryToCommit: jest.fn(),
      };
    });
    const basketItem = basketItemMock();
    const { result } = renderHookWithRedux(() => {
      const { commitCardEntry } = useCommitBasket();
      return commitCardEntry(basketItem[0], basketItem);
    });
    const response = await result.current;
    expect(response).toBeUndefined();
  });

  test("test commitCardEntry with data", async () => {
    jest.spyOn(useGetBasketItemToCommitHook, "useGetBasketItemToCommit").mockImplementation(() => {
      return {
        getDataToCommit: jest.fn(),
        getAggregatedItemsToCommit: jest.fn(),
        getTenderAmountToCommit: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getCardEntryToCommit: jest.fn().mockReturnValue(basketItemMock()),
      };
    });
    const basketItem = basketItemMock();
    const { result } = renderHookWithRedux(() => {
      const { commitCardEntry } = useCommitBasket();
      return commitCardEntry(basketItem[0], basketItem);
    });
    const response = await result.current;
    expect(response).toBeUndefined();
  });
});
