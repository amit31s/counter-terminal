import { store } from "@ct/common";
import { PEDFulfillerActions } from "postoffice-commit-and-fulfill";
import { FulfillmentStatusEnum } from "../updateFulfillment.slice";
import { loadNbitBasket } from "./basketAsyncThunk";

const mockData = {
  basket: {
    BasketClosedTime: 123,
    BasketCreatedTime: 456,
    basketCore: {
      NumberOfEntries: 2,
      basketID: "mock-id",
      basketState: "",
    },
  },
  entries: [
    {
      entryID: "1",
      RequestUDID: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
      entryCore: {
        transactionStartTime: 1670593662,
        itemID: "44310",
        quantity: 1,
        entryID: 1,
        valueInPence: 1,
        receiptLine: "1",
        tokens: {
          fulfilmentAction: PEDFulfillerActions.CashDeposit,
          APTransactionReference: "0001",
          POSTCODEZIP: " ",
          PREMISES: "1002 ST BOULAVARD",
          PRN2d: "02171EB60104609A",
          Product2d: "936",
          SenderAddress: "The Village School, Rendcomb, Cirencester, Gloucestershire",
          SenderName: "Post Office Ltd",
          SenderPostcode: "GL7 7HB",
          Weight2d: "0000150",
          clientAccountNo: "3147",
          clientSrvCode: "2",
          country: "USA",
          customerRefNumber: "JGB 428 6A021",
          destinationAddress: " ",
          existingReversalAllowed: "Y",
          firstAddressLine: "1002 ST BOULAVARD",
          itemType: "APADC",
          paymentCode: "1",
          receiptReference: "42  H",
          requestUDID: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
          tokenIdentifier: "6321",
          versionNumber: "1",
        },
      },
      fulfilment: {
        fulfilmentState: FulfillmentStatusEnum.SUCCESS,
        fulfilmentTokens: null,
      },
      transactionEndTime: 1670593664,
      basketID: "2222221-42-1",
      fadCode: "2222221",
      organizationCodeVersion: "1",
      deviceType: "2",
      deviceID: "AAAA000DEV",
      nodeID: "42",
      basketSeqNum: 1,
      transmissionSource: "SP",
    },
  ],
};

const loadNBIT = {
  branchID: "2222221",
  nodeID: 34,
};

jest.mock("@ct/api/generator/endpoints/transactions/transactions", () => ({
  useGetLastBasketHook: () => {
    return () => ({
      ...mockData,
    });
  },
}));

jest.mock("@ct/utils/Storage", () => ({
  ...jest.requireActual("@ct/utils/Storage"),
  getItem: () => "n",
}));

// Load generator from above mock file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const transaction = require("@ct/api/generator/endpoints/transactions/transactions");

describe("Testing loadNbitBasket hook", () => {
  test("basket should not contain any item after restart if number of entry is zero", async () => {
    jest.spyOn(transaction, "useGetLastBasketHook").mockReturnValue(() => ({
      ...mockData,
      basket: {
        BasketClosedTime: 123,
        BasketCreatedTime: 456,
        basketCore: {
          NumberOfEntries: 0,
        },
      },
    }));
    const abort = store.dispatch(loadNbitBasket(loadNBIT));
    const result = await abort;
    expect(result.payload).toBe(undefined);
  });

  test("basket should not contain any item if basket_id not found", async () => {
    jest.spyOn(transaction, "useGetLastBasketHook").mockReturnValue(() => ({
      ...mockData,
      basket: {
        BasketClosedTime: 123,
        BasketCreatedTime: 456,
        basketCore: {
          NumberOfEntries: 2,
        },
      },
    }));
    const abort = store.dispatch(loadNbitBasket(loadNBIT));
    const result = await abort;
    expect(result.payload).toBe(undefined);
  });

  test("basket should contain item", async () => {
    jest.spyOn(transaction, "useGetLastBasketHook").mockReturnValue(() => ({
      ...mockData,
    }));
    const abort = store.dispatch(loadNbitBasket(loadNBIT));
    const { payload } = await abort;
    expect(payload).not.toBe(undefined);
  });

  test("basket should contain item with payment entry", async () => {
    mockData.entries[0].entryCore.tokens.fulfilmentAction = PEDFulfillerActions.Debit;
    jest.spyOn(transaction, "useGetLastBasketHook").mockReturnValue(() => ({
      ...mockData,
    }));
    const abort = store.dispatch(loadNbitBasket(loadNBIT));
    const { payload } = await abort;
    expect(payload).not.toBe(undefined);
  });

  test("basket should contain item with cash withdrawal", async () => {
    mockData.entries[0].entryCore.tokens.fulfilmentAction = PEDFulfillerActions.CashWithdrawal;
    jest.spyOn(transaction, "useGetLastBasketHook").mockReturnValue(() => ({
      ...mockData,
    }));
    const abort = store.dispatch(loadNbitBasket(loadNBIT));
    const { payload } = await abort;
    expect(payload).not.toBe(undefined);
  });
});
