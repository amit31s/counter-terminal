import { NativeModules } from "react-native";

NativeModules.PayzoneApiModule = {
  addListener: () => true,
  removeListeners: () => true,

  initTransaction: jest.fn(),
  completeTransaction: jest.fn(),
  completeTransactionFailed: jest.fn(),
  markTransactionSuccess: jest.fn(),
  markTransactionFailed: jest.fn(),
  markReceiptPrinted: jest.fn(),
};

NativeModules.SaioPrinterModule = {
  printReceipt: jest.fn(),
};
