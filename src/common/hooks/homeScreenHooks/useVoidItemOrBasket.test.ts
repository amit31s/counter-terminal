import { renderHookWithRedux } from "@ct/common/helpers";
import { BasketStateEnum } from "@ct/common/hooks";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { basketItemMock } from "@ct/utils/MockData";
import * as customHook from "@ct/utils/Services/CommitFulfillService/transactionApi";
import { useVoidItemOrBasket } from "./useVoidItemOrBasket";

describe("Testing useVoidItemOrBasket hook", () => {
  test("isItemVoidable Should return false when commitStatus is not success", async () => {
    const items = basketItemMock();
    const item = items[0];
    item.commitStatus = CommitStatus.success;
    if (item.journeyData) {
      item.journeyData.transaction.entryID = 1;
    }
    jest.spyOn(customHook, "transactionApiClient").mockImplementation(() => {
      return {
        createBasket: jest.fn(),
        getBasket: jest.fn(),
        getLastSeqNumber: jest.fn(),
        lastBasketID: jest.fn(),
        closeBasket: jest.fn(),
        getBasketId: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getLastBasket: () => {
          return {
            data: {
              basket: {
                basketCore: {
                  NumberOfEntries: 1,
                },
              },
              entries: [{ entryCore: { entryID: item.journeyData?.transaction.entryID } }],
            },
          } as never;
        },
        client: jest.fn() as never,
      };
    });

    const { result } = renderHookWithRedux(() => {
      const { isItemVoidable } = useVoidItemOrBasket();
      return isItemVoidable(items[0]);
    }, {});
    const status = await result.current;
    expect(status).toEqual(false);
  });

  test("Should return false when item is non voidable", async () => {
    const items = basketItemMock();

    for (let index = 0; index < items.length; index++) {
      items[index].commitStatus = CommitStatus.notInitiated;
      items[index].source = "local";
      items[index].voidable = false;
    }

    jest.spyOn(customHook, "transactionApiClient").mockImplementation(() => {
      return {
        createBasket: jest.fn(),
        getBasket: jest.fn(),
        getLastSeqNumber: jest.fn(),
        lastBasketID: jest.fn(),
        closeBasket: jest.fn(),
        getBasketId: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getLastBasket: () => {
          return {
            data: {
              basket: {
                basketCore: {
                  NumberOfEntries: 1,
                },
              },
              entries: [{ entryCore: { entryID: 2 } }],
            },
          } as never;
        },
        client: jest.fn() as never,
      };
    });
    const basket = defaultBasketData();
    basket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { isItemVoidable, isBasketVoidable } = useVoidItemOrBasket();
        return { item: isItemVoidable(items[0]), basket: isBasketVoidable() };
      },
      { updateBasket: basket },
    );
    const status = await result.current;
    const itemStatus = await status.item;
    const basketStatus = await status.basket;
    expect(itemStatus).toEqual(false);
    expect(basketStatus).toEqual(false);
  });

  test("isItemVoidable should return true if commitStatus is success ", async () => {
    const items = basketItemMock();
    items[0].commitStatus = CommitStatus.notInitiated;
    jest.spyOn(customHook, "transactionApiClient").mockImplementation(() => {
      return {
        createBasket: jest.fn(),
        getBasket: jest.fn(),
        getLastSeqNumber: jest.fn(),
        lastBasketID: jest.fn(),
        closeBasket: jest.fn(),
        getBasketId: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getLastBasket: () => {
          return {
            data: {
              basket: {
                basketCore: {
                  NumberOfEntries: 0,
                },
              },
              entries: [],
            },
          } as never;
        },
        client: jest.fn() as never,
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { isItemVoidable } = useVoidItemOrBasket();
      return isItemVoidable(items[0]);
    }, {});
    const status = await result.current;
    expect(status).toEqual(true);
  });

  test("isBasketVoidable should return true if nothing has commited to basket ", async () => {
    const items = basketItemMock();
    items[0].commitStatus = CommitStatus.notInitiated;
    jest.spyOn(customHook, "transactionApiClient").mockImplementation(() => {
      return {
        createBasket: jest.fn(),
        getBasket: jest.fn(),
        getLastSeqNumber: jest.fn(),
        lastBasketID: jest.fn(),
        closeBasket: jest.fn(),
        getBasketId: jest.fn(),
        getNumberOfEntries: jest.fn(),
        getLastBasket: () => {
          return {
            data: {
              basket: {
                basketCore: {
                  NumberOfEntries: 0,
                  basketState: BasketStateEnum.Bkc,
                },
              },
              entries: [],
            },
          } as never;
        },
        client: jest.fn() as never,
      };
    });
    const { result } = renderHookWithRedux(() => {
      const { isBasketVoidable } = useVoidItemOrBasket();
      return isBasketVoidable();
    }, {});
    const status = await result.current;
    expect(status).toEqual(true);
  });
});
