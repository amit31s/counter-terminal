import { APP_LOGS_VARS } from "@ct/common/constants/AppLogger";
import { SERVER_ROOT } from "../../common/backendUrl";
import { getOriginalFeatureFlags } from "../featureFlags";
import { APP_CONSTANTS, getBaseURL, STRING_CONSTANTS, TEXT, URLConstants } from "../index";
import { PED_LOGS_VARS } from "@ct/common/constants/PEDLogs";

jest.mock("@ct/common/platformHelper", () => {
  return {
    envProvider: () => ({
      TRANSACTION_API_VERSION: "v2",
    }),
  };
});

describe("render URLConstants", () => {
  test("test get base url", () => {
    const baseUrl = getBaseURL();
    expect(baseUrl).toEqual(SERVER_ROOT);
  });

  test("test URLConstants cashTransfer", () => {
    const result = URLConstants.cashTransfer.getCashLocations("test-terminal-id", "test-branch-id");
    expect(result).toEqual(
      "/cash-drawer-association/association/list?counter_terminal_id=test-terminal-id&branch_id=test-branch-id",
    );
  });

  test("test URLConstants pouchAcceptance", () => {
    const result = URLConstants.pouchAcceptance.availablePouchList("test-branch-id");
    expect(result).toEqual("/pouch-management/pouch/dispatch/list?branch_id=test-branch-id");
  });

  test("test URLConstants pouchDispatch", () => {
    const accCardUrl = URLConstants.pouchDispatch.scanAccCard("test-acc-card");
    expect(accCardUrl).toEqual("/pouch-management/acc-card/validate?barcode=test-acc-card");

    const pouchBarcodeUrl = URLConstants.pouchDispatch.getPreparedPouchByBarcode(
      "test-barcode",
      "test-branch-id",
      "test-transaction-id",
    );
    expect(pouchBarcodeUrl).toEqual(
      "/pouch-management/pouch/prepared/validate?barcode=test-barcode&transaction_id=test-transaction-id&branch_id=test-branch-id",
    );
  });

  test("test URLConstants getCounter", () => {
    const getCounterUrl = URLConstants.getCounter("test-branch-id");
    expect(getCounterUrl).toEqual(
      "/cash-drawer-association/onboarded/list?branch_id=test-branch-id&entity_type=counter_terminal",
    );
  });

  test("test URLConstants getRecieptData", () => {
    const receiptDataUrl = URLConstants.getRecieptData("test-branch-id", "test-terminal-id");
    expect(receiptDataUrl).toEqual(
      "/ct-utility-services/receipt/list?counter_terminal_id=test-terminal-id&branch_id=test-branch-id",
    );
  });

  test("test logger message", () => {
    expect(APP_LOGS_VARS.valueNotReceived("test")).not.toBeUndefined();
    expect(APP_LOGS_VARS.tokenNotFoundEndPoint("test")).not.toBeUndefined();
    expect(PED_LOGS_VARS.cardAmountMultipleOf(0)).not.toBeUndefined();
    expect(APP_LOGS_VARS.branchPermissionPassedFadCode("test")).not.toBeUndefined();
    expect(APP_LOGS_VARS.branchPermissionFailedFadCode("test")).not.toBeUndefined();
    expect(APP_LOGS_VARS.basketClosedFrom("test")).not.toBeUndefined();
  });

  test("test app constants", () => {
    expect(APP_CONSTANTS.CONST0006("test")).not.toBeUndefined();
    expect(APP_CONSTANTS.CONST0010("test")).not.toBeUndefined();
  });

  test("test string constants", () => {
    const cardLimitMessage = STRING_CONSTANTS.transactionalMessages.cardLimitMessage(10);
    expect(cardLimitMessage).not.toBeUndefined();
    expect(STRING_CONSTANTS.paymentAlertMsg.cardPaymentLimitMsg("test")).not.toBeUndefined();
  });

  test("test text", () => {
    expect(TEXT.CTTXT0008(10, "unit")).not.toBeUndefined();
    expect(TEXT.CTTXT00027("test")).not.toBeUndefined();
    expect(TEXT.CTTXT00034("test")).not.toBeUndefined();
    expect(TEXT.CTTXT0045("test")).not.toBeUndefined();
    expect(TEXT.CTTXT0045(undefined)).not.toBeUndefined();
  });

  test("test feature flag", () => {
    expect(getOriginalFeatureFlags()).not.toBeUndefined();
  });
});
