import { renderHookWithRedux } from "@ct/common/helpers";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { STATE_CONSTANTS } from "@ct/constants";
import { basketItemMock } from "@ct/utils/MockData";
import { CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import {
  calculatedPrice,
  constructedItem,
  isValidAggregatedItem,
  useGetBasketItemToCommit,
} from "../useGetBasketItemToCommit";

jest.mock("@ct/utils/Services/CommitFulfillService/transactionApi", () => ({
  transactionApiClient: () => ({
    getLastBasket: () => ({
      data: {
        basket: {
          basketCore: {
            basketID: "",
            NumberOfEntries: 0,
          },
        },
        entries: [],
      },
    }),
    getNumberOfEntries: () => 1,
  }),
}));

describe("Testing useGetBasketItemToCommit hook", () => {
  test("basketItemsToCommitAfterPayment length should zero when all items have zero value", async () => {
    const items = basketItemMock();
    items.forEach((item) => {
      item.price = 0;
    });
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { getDataToCommit } = useGetBasketItemToCommit();
        return { getDataToCommit };
      },
      {
        updateBasket,
        updatePaymentStatus: {
          time: 0,
          completed: false,
          paidByCash: 0,
          paidByCard: 0,
          deductAmount: false,
          cashTenderReceivedAmount: 0,
          cashTenderTenderedAmount: 0,
          cashTenderReceivedAmountTxCommited: false,
          cashTenderTenderedAmountTxCommited: false,
          isRepayMode: false,
          txStatus: "",
        },
      },
    );
    const data = await result.current.getDataToCommit(items, "completed", 0);
    expect(data).toEqual(undefined);
  });

  test("getAggregatedItemsToCommit should return only item which is having Aggregated flag", async () => {
    const items = basketItemMock();
    items.forEach((item) => {
      item.journeyData.transaction.commitAndFulfillPoint = "immediate";
    });
    items[0].journeyData.transaction.commitAndFulfillPoint = "aggregated";
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    const { result } = renderHookWithRedux(
      () => {
        const { getAggregatedItemsToCommit } = useGetBasketItemToCommit();
        return { getAggregatedItemsToCommit };
      },
      {
        updateBasket,
        updatePaymentStatus: {
          time: 0,
          completed: false,
          paidByCash: 0,
          paidByCard: 0,
          deductAmount: false,
          cashTenderReceivedAmount: 0,
          cashTenderTenderedAmount: 0,
          cashTenderReceivedAmountTxCommited: false,
          cashTenderTenderedAmountTxCommited: false,
          isRepayMode: false,
          txStatus: "",
        },
      },
    );
    const data = await result.current.getAggregatedItemsToCommit(items);
    expect(data && data.length).toEqual(1);
  });

  test("test isValidAggregatedItem before commit aggregated item", async () => {
    const items = basketItemMock();
    items.forEach((item) => {
      item.price = 0;
      item.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Immediate;
    });

    const commitAndFulfillPoint = items[0].journeyData.transaction.commitAndFulfillPoint;
    const isValid = isValidAggregatedItem(true, commitAndFulfillPoint, items[0].price);
    expect(isValid).toEqual(true);
  });

  test("test isValidAggregatedItem after commit aggregated item", async () => {
    const items = basketItemMock();
    items.forEach((item) => {
      item.price = 10;
      item.journeyData.transaction.commitAndFulfillPoint = CommitAndFulfillPointEnum.Aggregated;
    });

    const commitAndFulfillPoint = items[0].journeyData.transaction.commitAndFulfillPoint;
    const isValid = isValidAggregatedItem(false, commitAndFulfillPoint, items[0].price);
    expect(isValid).toEqual(true);
  });

  test("test calculatedPrice for prepared data", async () => {
    const items = basketItemMock();
    items[0].price = 10;
    items[0].journeyData.transaction.valueInPence = "2000";

    const transactionData = items[0].journeyData.transaction;
    const price = calculatedPrice(true, transactionData, items[0].price);
    expect(price).toEqual(2000);
  });

  test("test calculatedPrice without prepared data", async () => {
    const items = basketItemMock();
    items[0].price = 10;
    items[0].journeyData.transaction.valueInPence = undefined;

    const transactionData = items[0].journeyData.transaction;
    const price = calculatedPrice(false, transactionData, items[0].price);
    expect(price).toEqual(1000);
  });

  test("test constructedItem basket item data", async () => {
    const items = basketItemMock();
    items[0].commitStatus = CommitStatus.notInitiated;
    items[0].fulFillmentStatus = STATE_CONSTANTS.FULFILLMENT_NOT_INITIATED;
    items[0].journeyData.transaction.entryID = 0;

    const { basketItem, entryCount } = constructedItem(items[0], 102);
    expect(basketItem.commitStatus).toEqual(CommitStatus.commitInitiated);
    expect(basketItem.fulFillmentStatus).toEqual(STATE_CONSTANTS.FULFILLMENT_INITIATED);
    expect(basketItem.journeyData.transaction.entryID).toEqual(102);
    expect(entryCount).toEqual(103);
  });
});
