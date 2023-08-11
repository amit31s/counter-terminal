import { TransferCore } from "@ct/api/generator";
import { APP_CONSTANTS } from "@ct/constants";
import { uuid } from "../utils";

export const pouchObjectMock: TransferCore = {
  id: uuid(),
  itemID: APP_CONSTANTS.CONST0001,
  quantity: 1,
  fadCode: "2314010",
  valueInPence: 100,
  additionalItems: [],
  transactionMode: APP_CONSTANTS.CONST0002,
  stockunitIdentifier: APP_CONSTANTS.CONST0003,
  accountReferenceID: "mockBarcode",
  tokens: {
    UPUTrackingNumber: APP_CONSTANTS.CONST0004,
  },
};
