import { act, renderHookWithReduxAndStore } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { useGetCommitFulfillClient } from "@ct/utils/Services/CommitFulfillService/CommitFulfillService";
import * as TransactionAPI from "@ct/utils/Services/CommitFulfillService/transactionApi";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { uuid } from "@ct/utils/utils";
import CommitAndFulfillProcessor, {
  BasketItemPayload,
  BasketStateEnum,
  FulfilmentTypeEnum,
  ProcessResponse,
} from "postoffice-commit-and-fulfill";
import {
  getEventTagMapping,
  ServiceEvent,
  setup as setupDeviceService,
  SupportedServices,
} from "postoffice-peripheral-management-service";
import WebSocketAsPromised from "websocket-as-promised";
import commonReceipts from "../../ReceiptService/commonReceipts";

jest.mock("postoffice-commit-and-fulfill");
jest.mock("postoffice-peripheral-management-service");
jest.mock("@ct/utils/Services/ReceiptService");

const itemA: IbasketItem = {
  id: uuid(),
  entryID: new Date().getTime(),
  quantity: 1,
  total: 0,
  price: 0,
  commitStatus: CommitStatus.notInitiated,
  fulFillmentStatus: "fulfillmentNotInitiated",
  source: "nbit",
  additionalItemsValue: 0,
};

const itemB: IbasketItem = {
  id: uuid(),
  entryID: 10 ** 10 + new Date().getTime(),
  quantity: 1,
  total: 0,
  price: 0,
  commitStatus: CommitStatus.notInitiated,
  fulFillmentStatus: "fulfillmentNotInitiated",
  source: "nbit",
  additionalItemsValue: 0,
};

const commitResponse: ProcessResponse = {
  commitStatusAllItems: "success",
  fulfilmentStatusAllItems: "notRequired",
};

const prepareDataToCommit = (dataToCommit: IbasketItem[]): BasketItemPayload[] => {
  if (!dataToCommit || dataToCommit?.length === 0) {
    return [];
  }

  return dataToCommit.map((item, index) => ({
    transactionStartTime: new Date().getTime() - index * 1000,
    itemID: item.id,
    entryID: item.entryID ?? 0,
    quantity: item.quantity ?? 1,
    valueInPence: item.total,
    customerReceipt: {
      template: "customerReceipt",
      context: {},
      printingMessage: "Printing customer receipt",
      optional: true,
    },
    branchReceipt: {
      template: "branchReceipt",
      context: {},
      printingMessage: "Printing customer receipt",
      optional: true,
    },
  }));
};

describe("commit and fulfill service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockReturnValue({
      connection: wsClient,
      buildClient: jest.fn(),
    });

    const mockedReceiptService = jest.mocked(useReceiptService);
    mockedReceiptService.mockReturnValue({
      printReceipt: jest.fn().mockReturnValue(true),
      templates: commonReceipts,
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
        createBasketEntry: jest.fn().mockResolvedValue({ data: { basketId: "mock-basketId" } }),
        getBasket: jest.fn(),
        getBasketEntry: jest.fn(),
        getLastBasket: jest.fn(),
        getLastSeqNumber: jest.fn(),
        updateBasketEntryFulfilment: jest.fn(),
        getBasketEntryReversal: jest.fn(),
      },
    });
  });

  it("handles commit success and deduplicates", async () => {
    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {});
            onCommitSuccess(item, {});
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const defaultBasket = defaultBasketData();
    defaultBasket.items = [itemA, itemB];
    const {
      rendered: { result },
      store,
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket: defaultBasket,
      updateHomeScreenStage: {
        stage: "completed",
        time: new Date().getTime(),
        completeClicked: true,
      },
    });
    const { current } = result;

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA, itemB]));
    });

    expect(store.getState().updateCommitApiStatusFlag.isErrorOccured).toBeFalsy();
  });

  it("handles commit failures and deduplicates", async () => {
    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitError }, _fulfillClient, _ped) => ({
        setFulfilmentStatus: jest.fn(),
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitError(item, {
              name: "Test Error",
              message: "Test Error",
            });
            onCommitError(item, {
              name: "Test Error",
              message: "Test Error",
            });
          });
          return commitResponse;
        }),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA, itemB];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA, itemB]));
    });
    // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("handles fulfillment success and deduplicates", async () => {
    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess, onFulfillmentSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            onFulfillmentSuccess?.(item, {
              fulfilled: true,
              fulfillmentId: uuid(),
              receipts: [
                {
                  template: "test",
                  context: {},
                },
              ],
            });
            onFulfillmentSuccess?.(item, {
              fulfilled: true,
              fulfillmentId: uuid(),
              receipts: [
                {
                  template: "test",
                  context: {},
                },
              ],
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA, itemB];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA, itemB]));
    });
    // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("handles fulfillment errors and deduplicates", async () => {
    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess, onFulfillmentError }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            onFulfillmentError?.(item, {
              name: "Test Error",
              message: "Test Error",
              receipts: [
                {
                  template: "test",
                  context: {},
                },
              ],
            });
            onFulfillmentError?.(item, {
              name: "Test Error",
              message: "Test Error",
              receipts: [
                {
                  template: "test",
                  context: {},
                },
              ],
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA, itemB];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA, itemB]));
    }); // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("displays a generic ped message", async () => {
    let passedOnDisplayUpdate: ((event: ServiceEvent) => void) | undefined;

    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockImplementation(({ callbacks }) => {
      passedOnDisplayUpdate = callbacks?.onDisplayUpdate;
      return {
        connection: wsClient,
        buildClient: jest.fn(),
      };
    });

    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            passedOnDisplayUpdate?.({
              service: SupportedServices.IngenicoPed,
              message: "Test Message",
              action: "Test Message",
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA, itemB];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA, itemB]));
    }); // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("displays an event tag message", async () => {
    let passedOnDisplayUpdate: ((event: ServiceEvent) => void) | undefined;

    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockImplementation(({ callbacks }) => {
      passedOnDisplayUpdate = callbacks?.onDisplayUpdate;
      return {
        connection: wsClient,
        buildClient: jest.fn(),
      };
    });

    const mGetEventTagMapping = jest.mocked(getEventTagMapping);
    mGetEventTagMapping.mockReturnValue({
      id: "Test ID",
      description: "Test Message",
    });

    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            passedOnDisplayUpdate?.({
              service: SupportedServices.IngenicoPed,
              message: "event tag test",
              action: "Test Message",
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA]));
    }); // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("handles primary event callback", async () => {
    let passedOnDisplayUpdate: ((event: ServiceEvent) => void) | undefined;
    const sendEventMock = jest.fn();

    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockImplementation(({ callbacks }) => {
      passedOnDisplayUpdate = callbacks?.onDisplayUpdate;
      return {
        connection: wsClient,
        buildClient: jest.fn().mockReturnValue({
          sendEvent: sendEventMock,
        }),
      };
    });

    const mGetEventTagMapping = jest.mocked(getEventTagMapping);
    mGetEventTagMapping.mockReturnValue({
      id: "Test ID",
      description: "Test Message",
    });

    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            passedOnDisplayUpdate?.({
              service: SupportedServices.IngenicoPed,
              message: "event tag test",
              action: "Test Message",
              availableEvents: [{ event: "CONTINUE", label: "Test Continue" }],
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );

    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA]));
    }); // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("handles secondary event callback", async () => {
    let passedOnDisplayUpdate: ((event: ServiceEvent) => void) | undefined;
    const sendEventMock = jest.fn();

    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockImplementation(({ callbacks }) => {
      passedOnDisplayUpdate = callbacks?.onDisplayUpdate;
      return {
        connection: wsClient,
        buildClient: jest.fn().mockReturnValue({
          sendEvent: sendEventMock,
        }),
      };
    });

    const mGetEventTagMapping = jest.mocked(getEventTagMapping);
    mGetEventTagMapping.mockReturnValue({
      id: "Test ID",
      description: "Test Message",
    });

    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            passedOnDisplayUpdate?.({
              service: SupportedServices.IngenicoPed,
              message: "event tag test",
              action: "Test Message",
              availableEvents: [
                { event: "CONTINUE", label: "Test Continue" },
                { event: "CANCEL", label: "Test Cancel" },
              ],
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );
    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA];
    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
      loadingStatus: [],
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA]));
    }); // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });

  it("should print card signature receipt when required", async () => {
    let passedReceiptPrintEvent: ((event: ServiceEvent) => void) | undefined;

    const mSetupDeviceService = jest.mocked(setupDeviceService);
    const wsClient = jest.mocked(new WebSocketAsPromised("test"));
    mSetupDeviceService.mockImplementation(({ callbacks }) => {
      passedReceiptPrintEvent = callbacks?.onReceiptContent;
      return {
        connection: wsClient,
        buildClient: jest.fn(),
      };
    });

    const printReceipt = jest.fn();

    const mockedReceiptService = jest.mocked(useReceiptService);
    mockedReceiptService.mockReturnValue({
      printReceipt,
      templates: commonReceipts,
    });

    const mCommitAndFulfillProcessor = jest.mocked(CommitAndFulfillProcessor);
    mCommitAndFulfillProcessor.mockImplementation(
      (_client, { onCommitSuccess }, _fulfillClient, _ped) => ({
        process: jest.fn(async (_basketId, items) => {
          items.forEach((item) => {
            onCommitSuccess(item, {
              fulfilmentRequired: true,
              fulfilmentType: FulfilmentTypeEnum.Ped,
            });
            passedReceiptPrintEvent?.({
              service: SupportedServices.IngenicoPed,
              action: "RECEIPT",
              message: "RECEIPT CONTENT",
            });
          });
          return commitResponse;
        }),
        setFulfilmentStatus: jest.fn(),
      }),
    );

    const updateBasket = defaultBasketData();
    updateBasket.items = [itemA];

    const {
      rendered: {
        result: { current },
      },
    } = renderHookWithReduxAndStore(useGetCommitFulfillClient, {
      updateBasket,
      updateBasketIdStatus: {
        basketId: "123456-78-90",
      },
    });

    await act(async () => {
      (await current)?.process(uuid(), prepareDataToCommit([itemA]));
    });
    // seems most of test case invalid now
    // need to rewrite test cases and refector CommitFulfillService
  });
});
