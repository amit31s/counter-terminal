import { renderHookWithRedux } from "@ct/common/helpers";
import * as hook from "@ct/common/hooks/useAppDispatch";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { basketItemMock } from "@ct/utils/MockData";
import { useBasket } from "../useBasket";

describe("Testing useBasket hook", () => {
  test("testing itemNameByUuid method from useBasket hook ", () => {
    const uniqueID = "5960d948-e319-4fe5-811c-a260a9ed49c8";
    const secondItemId = "Balance Enquiry";
    const items = basketItemMock();
    if (items[0].journeyData?.transaction?.uniqueID) {
      items[0].journeyData.transaction.uniqueID = uniqueID;
    }
    items[0].id = secondItemId;
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { itemNameByUuid } = useBasket();
        return itemNameByUuid(uniqueID);
      },
      {
        updateBasket,
      },
    );

    expect(result.current).toEqual(secondItemId);
  });

  test("testing basketItemByUuid method from useBasket hook ", () => {
    const uniqueID = "5960d948-e319-4fe5-811c-a260a9ed49c8";

    const items = basketItemMock();
    if (items[0].journeyData?.transaction?.uniqueID) {
      items[0].journeyData.transaction.uniqueID = uniqueID;
    }
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { basketItemByUuid } = useBasket();
        return basketItemByUuid(uniqueID);
      },
      {
        updateBasket,
      },
    );
    expect(result.current).toEqual(expect.objectContaining(items[0]));
  });
  test("testing changeValueToZero method from useBasket hook with single uniqueID", () => {
    jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());

    const uniqueID = "5960d948-e319-4fe5-811c-a260a9ed49c8";
    const value = 500;
    const items = basketItemMock();
    if (items[0].journeyData?.transaction?.uniqueID) {
      items[0].journeyData.transaction.uniqueID = uniqueID;
      items[0].price = value;
      items[0].total = value;
    }
    expect(items[0].price).toEqual(value);
    expect(items[0].total).toEqual(value);
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { changeValueToZero } = useBasket();
        return changeValueToZero(uniqueID);
      },
      {
        updateBasket,
      },
    );
    expect(result.current[0].price).toEqual(0);
    expect(result.current[0].total).toEqual(0);
  });
  test("testing changeValueToZero method from useBasket hook with array of uniqueID", () => {
    jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());
    const uniqueID1 = "5960d948-e319-4fe5-811c-a260a9ed49c8";
    const uniqueID2 = "5960d948-e319-4fe5-811c-a260a9ed49c9";

    const value = 500;
    const items = basketItemMock();
    if (items[0].journeyData?.transaction?.uniqueID) {
      items[0].journeyData.transaction.uniqueID = uniqueID1;
      items[0].price = value;
      items[0].total = value;
    }
    if (items[1].journeyData?.transaction?.uniqueID) {
      items[1].journeyData.transaction.uniqueID = uniqueID2;
      items[1].price = value;
      items[1].total = value;
    }
    expect(items[0].price).toEqual(value);
    expect(items[0].total).toEqual(value);
    expect(items[1].price).toEqual(value);
    expect(items[1].total).toEqual(value);
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { changeValueToZero } = useBasket();
        return changeValueToZero([uniqueID1, uniqueID2]);
      },
      {
        updateBasket,
      },
    );
    expect(result.current[0].price).toEqual(0);
    expect(result.current[0].total).toEqual(0);
    expect(result.current[1].price).toEqual(0);
    expect(result.current[1].total).toEqual(0);
  });

  test("testing changeValueToZero method from useBasket hook with entryID", () => {
    jest.spyOn(hook, "useAppDispatch").mockImplementation(() => jest.fn());
    const uniqueID1 = undefined;
    const entryID = "1";

    const value = 500;
    const items = basketItemMock();
    if (items[0].journeyData?.transaction?.uniqueID) {
      items[0].journeyData.transaction.uniqueID = uniqueID1;
      items[0].journeyData.transaction.entryID = entryID;
      items[0].price = value;
      items[0].total = value;
    }
    expect(items[0].price).toEqual(value);
    expect(items[0].total).toEqual(value);
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { changeValueToZero } = useBasket();
        return changeValueToZero(entryID);
      },
      {
        updateBasket,
      },
    );
    expect(result.current[0].price).toEqual(0);
    expect(result.current[0].total).toEqual(0);
  });
});
