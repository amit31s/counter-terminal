import { ERROR } from "@ct/common/enums";
import { IInternalJourneyData } from "@ct/interfaces/basket.interface";
import * as homeService from "../index";
import { basketItemsArray, mockBasketDataList, newMockBasketDataList } from "../testData";

jest.mock("postoffice-product-journey-api-clients", () => {
  const original = jest.requireActual("postoffice-product-journey-api-clients");
  return {
    ...original,
    enablerAPIClientFactory: {
      buildClient: jest.fn().mockReturnValue({
        getProduct: jest.fn().mockReturnValue({
          longName: "longName",
          mediumName: "mediumName",
          itemType: "itemType",
          existingReversalAllowed: "existingReversalAllowed",
        }),
      }),
    },
  };
});

describe("Testing Home Service", () => {
  it("Testing prepareBasketItemData modifies data when an array of items is passed in", async () => {
    const saved = await homeService.prepareBasketItemData(
      mockBasketDataList as IInternalJourneyData,
      [],
    );
    expect(saved).not.toEqual(ERROR.NETWORK_ERROR);

    if (saved !== ERROR.NETWORK_ERROR) {
      expect(saved.basketArray).toHaveLength(2);
      saved.basketArray.forEach((basketItem) => {
        // the values are numbers
        expect(basketItem.price).toBe(0);
        expect(basketItem.total).toBe(0);
        expect(basketItem.voidable).toBe(true);
        expect(basketItem.commitStatus).toBe("notInitiated");
        expect(basketItem.journeyData?.transaction.valueInPence).toBe("0");
        expect(basketItem.journeyData?.transaction.transactionStartTime).toBeGreaterThan(1);
      });
    }
  });
  it("Testing prepareBasketItemData modifies data when an array of items has journeyType refund", async () => {
    const saved = await homeService.prepareBasketItemData(
      newMockBasketDataList as IInternalJourneyData,
      [],
    );
    expect(saved).not.toEqual(ERROR.NETWORK_ERROR);
    if (saved !== ERROR.NETWORK_ERROR) {
      expect(saved.basketArray).toHaveLength(1);
      saved.basketArray.forEach((basketItem) => {
        expect(basketItem.price).toBe(10);
        expect(basketItem.total).toBe(100);
        expect(basketItem.voidable).toBe(true);
        expect(basketItem.commitStatus).toBe("notInitiated");
        expect(basketItem.journeyData?.transaction.valueInPence).toBe("1000");
        expect(basketItem.journeyData?.transaction.transactionStartTime).toBeGreaterThan(1);
      });
    }
  });

  it("test isNonVoidableItemInBasket function", async () => {
    const isNonVoidableItemFound = homeService.isNonVoidableItemInBasket(basketItemsArray);
    expect(isNonVoidableItemFound).toBe(true);
    basketItemsArray[0].voidable = true;
    basketItemsArray[1].voidable = true;
    const isNonVoidableItme = homeService.isNonVoidableItemInBasket(basketItemsArray);
    expect(isNonVoidableItme).toBe(false);
  });

  it("test suspendBasket function", async () => {
    jest.spyOn(homeService, "suspendBasket").mockReturnValue(Promise.resolve(true));
    const isBasketSuspended = await homeService.suspendBasket(basketItemsArray);
    expect(isBasketSuspended).toBe(true);
    jest.spyOn(homeService, "suspendBasket").mockReturnValue(Promise.resolve(false));
    const isBasketNotSuspended = await homeService.suspendBasket(basketItemsArray);
    expect(isBasketNotSuspended).toBe(false);
  });
});
