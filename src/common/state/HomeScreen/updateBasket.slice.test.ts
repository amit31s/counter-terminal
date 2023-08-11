import { store } from "@ct/common";
import { basketItemMock } from "@ct/utils/MockData";

jest.mock("@ct/interfaces/basket.interface", () => ({
  IUpdateBasketState: () => {
    return () => ({
      items: [
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
      customerToPay: 0,
      postOfficeToPay: 0,
      total: 0,
      time: 0,
    });
  },
}));
describe("Basket redux state tests", () => {
  test("Update basket", async () => {
    const items = basketItemMock();
    const state = store.dispatch(store.getState);
    const result = await (state.updateBasket, items);
    expect(result.length).toBe(3);
  });

  test("updateCommitStatus of given id", async () => {
    const items = basketItemMock();
    const state = store.dispatch(store.getState);
    const result = await (state.updateBasket, items);
    const unchangedBasket = result.find(
      (basket) => basket.id === "Balance Enquiry Test100dd975-8a11-476d-a135-b5a84ec07168",
    );
    expect(unchangedBasket).toBe(result[0]);
  });

  test("updateBasket total value", async () => {
    const items = basketItemMock();
    const state = store.dispatch(store.getState);
    const result = await (state.updateBasket, items);
    const unchangedBasket = result.find(
      (basket) => basket.id === "Balance Enquiry Test100dd975-8a11-476d-a135-b5a84ec07168",
    );
    expect(unchangedBasket?.total).toBe(0);
  });
});
