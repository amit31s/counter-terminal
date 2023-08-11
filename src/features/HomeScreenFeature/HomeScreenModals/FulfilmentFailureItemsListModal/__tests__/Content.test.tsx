import { renderWithRedux } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import {
  FulFillmentItem,
  FulfillmentStatusEnum,
} from "@ct/common/state/HomeScreen/updateFulfillment.slice";
import { EntryType, IbasketItem } from "@ct/interfaces";
import { CommitAndFulfillPointEnum } from "postoffice-commit-and-fulfill";
import * as booleanMock from "../Content";
import { Content, getCommitStatus, getDataAndRefundPrice } from "../Content";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getDataAndRefundPrice", () => {
  const items: IbasketItem[] = [
    {
      id: "1",
      name: "Item 1",
      price: 1,
      quantity: 1,
      total: 1,
      type: EntryType.paymentMode,
      commitStatus: CommitStatus.fail,
      additionalItemsValue: 0,
      fulFillmentStatus: "failure",
      source: "nbit",
    },
    {
      id: "2",
      name: "Item 2",
      price: 2,
      quantity: 1,
      total: 2,
      source: "nbit",
      type: EntryType.paymentMode,
      commitStatus: CommitStatus.fail,
      additionalItemsValue: 0,
      fulFillmentStatus: "failure",
    },
  ];

  it("returns correct data and price for two failed items", () => {
    const failedItems = [
      {
        id: "Test1",
        fulfillmentStatus: FulfillmentStatusEnum.FAILED,
      },
      {
        id: "Test2",
        fulfillmentStatus: FulfillmentStatusEnum.FAILED,
      },
    ] as FulFillmentItem[];
    const basketItemByUuid = jest.fn().mockReturnValueOnce(items[0]).mockReturnValue(items[1]);
    expect(getDataAndRefundPrice(failedItems, basketItemByUuid)).toEqual({
      priceToRefund: 3,
      newData: [
        {
          id: "1",
          name: "Item 1",
          price: 1,
          quantity: 1,
          total: 1,
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
          source: "nbit",
        },
        {
          id: "2",
          name: "Item 2",
          price: 2,
          quantity: 1,
          total: 2,
          source: "nbit",
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
        },
      ] as IbasketItem[],
    });
    expect(basketItemByUuid).toBeCalledTimes(2);
  });
});

describe("getCommitStatus", () => {
  describe("false cases", () => {
    it("returns false if no data", () => {
      expect(getCommitStatus([])).toBe(false);
    });

    it("returns false if journeydata has length greater than 1", () => {
      const data1: IbasketItem[] = [
        {
          id: "1",
          name: "Item 1",
          price: 0,
          quantity: 1,
          total: 1,
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
          source: "nbit",
          journeyData: {
            transaction: {
              commitAndFulfillPoint: CommitAndFulfillPointEnum.Immediate,
            },
          },
        },
        {
          id: "2",
          name: "Item 2",
          price: 1,
          quantity: 1,
          total: 1,
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
          source: "nbit",
          journeyData: {
            transaction: {
              commitAndFulfillPoint: CommitAndFulfillPointEnum.Immediate,
            },
          },
        },
      ];
      expect(getCommitStatus(data1)).toBe(false);
    });

    it("returns false if commitAndFulfillPoint equals Aggregated and price greater than 0 ", () => {
      const data: IbasketItem[] = [
        {
          id: "1",
          name: "Item 1",
          price: 1,
          quantity: 1,
          total: 1,
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
          source: "nbit",
          journeyData: {
            transaction: {
              commitAndFulfillPoint: CommitAndFulfillPointEnum.Aggregated,
            },
          },
        },
      ];
      expect(getCommitStatus(data)).toBe(false);
    });
  });
  describe("true cases", () => {
    it("returns true if commit and fulfill equals immediate", () => {
      const data: IbasketItem[] = [
        {
          id: "1",
          name: "Item 1",
          price: 1,
          quantity: 1,
          total: 1,
          type: EntryType.paymentMode,
          commitStatus: CommitStatus.fail,
          additionalItemsValue: 0,
          fulFillmentStatus: "failure",
          source: "nbit",
          journeyData: {
            transaction: {
              commitAndFulfillPoint: CommitAndFulfillPointEnum.Immediate,
            },
          },
        },
      ];
      expect(getCommitStatus(data)).toBe(true);
    });
  });
});

describe("content component", () => {
  describe("basic rendering", () => {
    it("renders transaction declined component if failure before payment", () => {
      jest.spyOn(booleanMock, "getCommitStatus").mockReturnValue(true);
      const { getByText } = renderWithRedux(<Content />);
      expect(getByText("Transaction Declined")).toBeInTheDocument();
    });

    it("renders transaction refund/list component if failure after payment", () => {
      jest.spyOn(booleanMock, "getCommitStatus").mockReturnValue(false);
      const { getByText } = renderWithRedux(<Content />);
      expect(getByText("Unable to complete transaction.")).toBeInTheDocument();
    });
  });
  describe("useEffect", () => {
    renderWithRedux(<Content />);
  });
});
