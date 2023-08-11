import { STATE_CONSTANTS } from "@ct/constants";
import { poundToPence } from "@ct/utils";
import { cardPaymentPayload, cashPaymentPayload, chequePaymentPayload } from ".";

jest.mock("@ct/common", () => {
  const realCommon = jest.requireActual("@ct/common");
  realCommon.getStockUnitIdentifier = jest.fn().mockResolvedValue("C01");
  return realCommon;
});

jest.mock("postoffice-product-journey-api-clients", () => {
  const original = jest.requireActual("postoffice-product-journey-api-clients");
  return {
    ...original,
    enablerAPIClientFactory: {
      buildClient: jest.fn().mockReturnValue({
        getProduct: jest.fn().mockReturnValue({
          mediumName: "mediumName",
          longName: "longName",
          itemType: "itemType",
          existingReversalAllowed: "existingReversalAllowed",
        }),
      }),
    },
  };
});

describe("Testing getAmountCommitPayload", () => {
  test("Testing cashPaymentPayload method", async () => {
    const payload = await cashPaymentPayload(10, 1, STATE_CONSTANTS.CASH, "");
    expect(payload.transactionStartTime).toBeGreaterThan(0);
    expect(payload.valueInPence).toBe(1000);
  });

  test("Testing cashPaymentPayload method for refund", async () => {
    const payload = await cashPaymentPayload(10, 1, STATE_CONSTANTS.CASH, "refund");
    expect(payload.transactionStartTime).toBeGreaterThan(0);
    expect(payload.valueInPence).toBe(1000);
  });

  test("Testing cardPaymentPayload method", async () => {
    const mediumName = "Test mediumName";
    const itemID = "Test itemID";
    const transactionId = "Test transactionId";
    const uuid = "Test uuid";
    const obfuscatedPan = "1234";
    const paymentId = "123456789";

    const cardPaymentAmount = 10;
    const referenceDataCheck = {
      item: { mediumName, itemID },
    };
    const payload = await cardPaymentPayload(
      referenceDataCheck,
      obfuscatedPan,
      paymentId,
      cardPaymentAmount,
      transactionId,
      uuid,
      "",
    );
    const cardPaymentAmountInPence = poundToPence(cardPaymentAmount);
    expect(payload.name).toEqual("mediumName");
    expect(payload.id).toEqual(itemID + uuid);
    expect(payload.journeyData?.basket?.id).toEqual("mediumName");
    expect(payload.journeyData?.transaction?.itemID).toEqual(itemID);
    expect(payload.journeyData?.transaction?.tokens?.horizonTransactionID).toEqual(transactionId);
    expect(payload.journeyData?.transaction?.valueInPence).toEqual(cardPaymentAmountInPence);
    expect(payload.journeyData?.transaction?.uniqueID).not.toBeFalsy();
    expect(payload.journeyData?.transaction?.transactionStartTime).not.toBeFalsy();
  });
  test("Testing cardPaymentPayload method for refund", async () => {
    const mediumName = "Test mediumName";
    const itemID = "Test itemID";
    const transactionId = "Test transactionId";
    const uuid = "Test uuid";
    const obfuscatedPan = "1234";
    const paymentId = "123456789";

    const cardPaymentAmount = 10;
    const referenceDataCheck = {
      item: { mediumName, itemID },
    };
    const payload = await cardPaymentPayload(
      referenceDataCheck,
      obfuscatedPan,
      paymentId,
      cardPaymentAmount,
      transactionId,
      uuid,
      "refund",
    );
    const cardPaymentAmountInPence = poundToPence(cardPaymentAmount);
    expect(payload.name).toEqual("mediumName");
    expect(payload.id).toEqual(itemID + uuid);
    expect(payload.journeyData?.basket?.id).toEqual("mediumName");
    expect(payload.journeyData?.transaction?.itemID).toEqual(itemID);
    expect(payload.journeyData?.transaction?.tokens?.horizonTransactionID).toEqual(transactionId);
    expect(payload.journeyData?.transaction?.valueInPence).toEqual(cardPaymentAmountInPence);
    expect(payload.journeyData?.transaction?.uniqueID).not.toBeFalsy();
    expect(payload.journeyData?.transaction?.transactionStartTime).not.toBeFalsy();
  });

  test("Should quantity positive if valueInPence is positive", async () => {
    const value = 10;
    const payload = await cashPaymentPayload(
      value,
      1,
      STATE_CONSTANTS.CASH_TENDER_TENDERED_AMOUNT,
      "",
    );
    expect(payload.quantity).toEqual(1);
  });

  test("Should quantity negative if valueInPence is negative", async () => {
    const value = -10;
    const payload = await cashPaymentPayload(
      value,
      1,
      STATE_CONSTANTS.CASH_TENDER_TENDERED_AMOUNT,
      "",
    );
    expect(payload.quantity).toEqual(-1);
  });

  test("Testing cashPaymentPayload for quantity for refund", async () => {
    const itemID = "1";
    const value = 10;
    const payload = await cashPaymentPayload(
      value,
      1,
      STATE_CONSTANTS.CASH_TENDER_TENDERED_AMOUNT,
      "refund",
    );
    const valueInPence = poundToPence(value);
    expect(payload.itemID).toEqual(itemID);
    expect(payload.valueInPence).toEqual(valueInPence);
    expect(payload.transactionStartTime).not.toBeFalsy();
    expect(payload.quantity).toEqual(1);
  });
  it("should return the correct sales payload for cheque payment", async () => {
    const value = 50;
    const entryID = 123;
    const type = STATE_CONSTANTS.CHEQUE;
    const journeyType = "someJourneyType";

    const expectedPayload = {
      quantity: 1,
      entryID: 123,
      valueInPence: 5000,
      transactionStartTime: expect.any(Number),
      itemID: expect.anything(),
      additionalItems: [],
      stockunitIdentifier: expect.anything(),
      methodOfDataCapture: 1,
      refundFlag: "N",
      fallBackModeFlag: "N",
      uniqueID: type,
      tokens: {
        entryID: "" + entryID,
        productDescription: "mediumName",
        itemType: "itemType",
        existingReversalAllowed: "existingReversalAllowed",
      },
    };

    const payload = await chequePaymentPayload(value, entryID, type, journeyType);

    expect(payload).toEqual(expectedPayload);
  });
});
