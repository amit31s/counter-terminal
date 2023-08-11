/* eslint-disable @typescript-eslint/no-var-requires */
import * as common from "@ct/common";
import { renderHook } from "@ct/common/helpers/test-utils";
import { usePrintOnCloseBasket } from "./usePrintOnCloseBasket";

jest.mock("@ct/common", () => ({
  getBasket: jest.fn(),
  getBasketIdStatus: jest.fn(),
  getStockUnitIdentifier: jest.fn(),
  RootState: {},
  useAppSelector: jest.fn(),
}));
jest.mock("@ct/utils/Services/ReceiptService", () => ({
  useReceiptService: jest.fn(() => ({
    printReceipt: jest.fn(),
  })),
}));
jest.mock("@pol/frontend-logger-web", () => ({
  logManager: jest.fn(() => ({
    error: jest.fn(),
  })),
}));
jest.mock("postoffice-prepare-receipt-context", () => ({
  PrepareContext: {},
  prepareContextAndPrintReceipt: jest.fn(),
  prepareSpoiltLabelContext: jest.fn(),
  prepareCharityReceipt: jest.fn(),
  SpoiltLabelContext: {},
}));
jest.mock("postoffice-electron-context-bridge-js", () => ({
  LOGGER_TYPE: {},
}));

describe("usePrintOnCloseBasket", () => {
  it("should print receipt and spoilt label", async () => {
    const basketId = "123";
    const branchID = "456";
    const branchName = "Branch";
    const branchPostcode = "12345";
    const successItems = [
      { id: "1", name: "item 1" },
      { id: "2", name: "item 2" },
    ];
    const branchAddress = "Address";
    const deviceType = "type";
    const nodeID = "0";
    const printReceipt = jest.fn();

    // Mock the necessary selectors
    jest.spyOn(common, "getBasketIdStatus").mockReturnValue({ basketId });
    jest.spyOn(require("@ct/common"), "useAppSelector").mockImplementation((selector) => {
      if (selector === require("@ct/common").getBasket) {
        return { successItems };
      } else if (typeof selector === "function") {
        return selector({
          auth: {
            device: { branchID, branchName, branchPostcode, branchAddress, deviceType, nodeID },
          },
        });
      }
    });

    // Mock the receipt service hook
    jest.spyOn(require("@ct/utils/Services/ReceiptService"), "useReceiptService").mockReturnValue({
      printReceipt,
    });

    // Mock the receipt context functions
    jest
      .spyOn(require("postoffice-prepare-receipt-context"), "prepareCharityReceipt")
      .mockResolvedValue({
        templateId: "charity_template",
        context: {},
      });
    jest
      .spyOn(require("postoffice-prepare-receipt-context"), "prepareContextAndPrintReceipt")
      .mockResolvedValue({
        templateId: "receipt_template",
        context: {},
      });
    jest
      .spyOn(require("postoffice-prepare-receipt-context"), "prepareSpoiltLabelContext")
      .mockResolvedValue({
        templateId: "label_template",
        context: {},
      });

    const { result } = renderHook(() => usePrintOnCloseBasket());
    await result.current();

    // Verify that the receipt and spoilt label were printed with the correct templates and contexts
    expect(printReceipt).toHaveBeenCalledTimes(3);
    expect(printReceipt).toHaveBeenCalledWith({
      template: "charity_template",
      context: {},
    });
    expect(printReceipt).toHaveBeenCalledWith({
      template: "receipt_template",
      context: {},
    });
    expect(printReceipt).toHaveBeenCalledWith({
      template: "label_template",
      context: {},
    });

    // Verify that the context functions were called with the correct arguments
    expect(
      require("postoffice-prepare-receipt-context").prepareContextAndPrintReceipt,
    ).toHaveBeenCalledWith(branchID, branchName, branchPostcode, basketId, successItems);
  });
});
