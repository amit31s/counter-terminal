import { renderHookWithRedux } from "@ct/common/helpers";
import * as TransactionAPI from "@ct/utils/Services/CommitFulfillService/transactionApi";
import { BasketStateEnum } from "postoffice-commit-and-fulfill";
import { useOpenBasket } from "./useOpenBasket";

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

describe("Testing useOpenBasket hook", () => {
  test("render useOpenBasket with respected screen", async () => {
    const { result } = renderHookWithRedux(() => useOpenBasket(), {});
    const response = await result.current.openBasket(undefined, "test-basket-id");
    expect(response.status).toBe(false);
  });

  test("render useOpenBasket with BasketStateEnum.Bko", async () => {
    const { result } = renderHookWithRedux(() => useOpenBasket(), {});
    const response = await result.current.openBasket(BasketStateEnum.Bko, "test-basket-id");
    expect(response.basketId).toBe("test-basket-id");
  });
});
