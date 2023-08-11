import { renderHookWithRedux } from "@ct/common/helpers";
import { AuthConfigType } from "@ct/common/state/auth.slice";
import { defaultDeviceData } from "@ct/common/state/initialStateData";
import { useGetTransactionsForRefundJourney } from "./useGetTransactionsForRefundJourney";

const basketData = {
  basket: {
    BasketClosedTime: 123,
    BasketCreatedTime: 456,
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
        valueInPence: 0,
        receiptLine: "1",
        tokens: {
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
          productDescription: "2D Bde Read Test",
          receiptReference: "42  H",
          requestUDID: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
          tokenIdentifier: "6321",
          versionNumber: "1",
        },
      },
      fulfilment: {
        fulfilmentState: "notRequired",
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
    {
      entryID: "1",
      RequestUDID: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
      entryCore: {
        transactionStartTime: 1670593662,
        itemID: "44311",
        quantity: 1,
        entryID: 1,
        valueInPence: 0,
        receiptLine: "1",
        tokens: {
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
          productDescription: "2D Bde Read Test",
          receiptReference: "42  H",
          requestUDID: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
          tokenIdentifier: "6321",
          versionNumber: "1",
        },
      },
      fulfilment: {
        fulfilmentState: "notRequired",
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

const transactionData = {
  Transactions: [
    {
      fadCode: "2222221",
      nodeID: "42",
      deviceID: "AAAA000DEV",
      deviceType: "2",
      basketID: "2222221-42-1",
      BasketCreatedTime: 1670593633,
      entryID: "1",
      BasketClosedTime: 1670593672,
      TransactionID: "TR222222142000000000100000001",
      TransactionMode: 1,
      TransactionStartTime: 1670593662,
      itemID: "44310",
      itemDescription: "RMG PO 2D Readability Test MI Item",
      quantity: 1,
      Tokens: {
        accountinglinenumber: "1",
        aptransactionreference: "0001",
        clientaccountno: "3147",
        clientsrvcode: "2",
        country: "USA",
        customerrefnumber: "JGB 428 6A021",
        despatch: "false",
        destinationaddress: " ",
        existingreversalallowed: "Y",
        firstaddressline: "1002 ST BOULAVARD",
        itemtype: "APADC",
        paymentcode: "1",
        postcodezip: " ",
        premises: "1002 ST BOULAVARD",
        prn2d: "02171EB60104609A",
        product2d: "936",
        productdescription: "2D Bde Read Test",
        receiptreference: "42  H",
        recordtypeidentifier: "APS",
        requestudid: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
        senderaddress: "The Village School, Rendcomb, Cirencester, Gloucestershire",
        sendername: "Post Office Ltd",
        senderpostcode: "GL7 7HB",
        tandt: "false",
        tokenidentifier: "6321",
        versionnumber: "1",
        versionnumberitemtransactionmode: "1",
        weight2d: "0000150",
      },
      TransactionEndTime: 1670593664,
    },
    {
      fadCode: "2222221",
      nodeID: "42",
      deviceID: "AAAA000DEV",
      deviceType: "2",
      basketID: "2222221-42-1",
      BasketCreatedTime: 1670593633,
      entryID: "1",
      BasketClosedTime: 1670593672,
      TransactionID: "TR222222142000000000100000009",
      TransactionMode: 1,
      TransactionStartTime: 1670593662,
      itemID: "44311",
      itemDescription: "RMG PO 2D Readability Test MI Item",
      quantity: 1,
      Tokens: {
        accountinglinenumber: "1",
        aptransactionreference: "0001",
        clientaccountno: "3147",
        clientsrvcode: "2",
        country: "USA",
        customerrefnumber: "JGB 428 6A021",
        despatch: "false",
        destinationaddress: " ",
        existingreversalallowed: "Y",
        firstaddressline: "1002 ST BOULAVARD",
        itemtype: "APADC",
        paymentcode: "1",
        postcodezip: " ",
        premises: "1002 ST BOULAVARD",
        prn2d: "02171EB60104609A",
        product2d: "936",
        productdescription: "2D Bde Read Test",
        receiptreference: "42  H",
        recordtypeidentifier: "APS",
        requestudid: "cb0e5ec9-30a3-40c6-811d-71c31d9ea767",
        senderaddress: "The Village School, Rendcomb, Cirencester, Gloucestershire",
        sendername: "Post Office Ltd",
        senderpostcode: "GL7 7HB",
        tandt: "false",
        tokenidentifier: "6321",
        versionnumber: "1",
        versionnumberitemtransactionmode: "1",
        weight2d: "0000150",
      },
      TransactionEndTime: 1670593664,
    },
  ],
};

jest.mock("@ct/api/generator", () => ({
  useGetBasketHook: () => {
    return () => basketData;
  },
  useGetTransactionsHook: () => {
    return () => transactionData;
  },
}));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const transaction = require("@ct/api/generator");
describe("Testing useGetTransactionsForRefundJourney hook", () => {
  test("testing basketTransactions method in useGetTransactionsForRefundJourney hook ", async () => {
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(2);
  });

  test("testing basketTransactions method in useGetTransactionsForRefundJourney hook without branchID ", async () => {
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = undefined as unknown as string;
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });

  test("testing basketTransactions without basketData", async () => {
    jest.spyOn(transaction, "useGetBasketHook").mockReturnValue(() => undefined);
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });

  test("testing basketTransactions with updated basketData", async () => {
    jest.spyOn(transaction, "useGetBasketHook").mockReturnValue(() => ({
      ...basketData,
      basket: {
        BasketClosedTime: 0,
        BasketCreatedTime: 0,
      },
    }));
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });

  test("testing basketTransactions without basketEntries and transaction", async () => {
    jest.spyOn(transaction, "useGetBasketHook").mockReturnValue(() => ({
      ...basketData,
      entries: undefined,
    }));
    jest.spyOn(transaction, "useGetTransactionsHook").mockReturnValue(() => undefined);
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });
  test("testing basketTransactions with error throw for basket data", async () => {
    jest.spyOn(transaction, "useGetBasketHook").mockReturnValue(() => {
      throw new Error();
    });
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });

  test("testing basketTransactions with error throw for transaction data", async () => {
    jest.spyOn(transaction, "useGetBasketHook").mockReturnValue(() => ({
      ...basketData,
      entries: undefined,
    }));
    jest.spyOn(transaction, "useGetTransactionsHook").mockReturnValue(() => {
      throw new Error();
    });
    const basketId = "2222221-42-1";
    const device = defaultDeviceData();
    device.branchID = "246745";
    const { result } = renderHookWithRedux(
      () => {
        const { basketTransactions } = useGetTransactionsForRefundJourney();
        return basketTransactions(basketId);
      },
      {
        auth: {
          device,
          session: null,
          deviceError: null,
          error: null,
          loading: true,
          user: null,
          userTokenData: null,
          isUserLoggedIn: false,
          userLoading: false,
          initialScreen: undefined,
          isDeviceRegistered: false,
          configStatus: AuthConfigType.DEVICE_CONFIG,
          authStatus: "idle",
          userLoginStarted: false,
        },
      },
    );

    const payload = await result.current;
    expect(payload.length).toEqual(0);
  });
});
