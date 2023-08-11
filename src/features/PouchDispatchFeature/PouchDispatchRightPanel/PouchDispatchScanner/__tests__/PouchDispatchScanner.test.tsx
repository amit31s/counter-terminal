import { renderWithRedux, setupUser } from "@ct/common";
import { TEXT } from "@ct/constants";

import { PouchDispatchScanner } from "../PouchDispatchScanner";

describe("Render PouchDispatchScanner", () => {
  it("PouchDispatchScanner rendered successfully", () => {
    const { getByTestId } = renderWithRedux(<PouchDispatchScanner />, {
      updatePouchDispatchList: {
        validatedData: [
          {
            pouchID: "397250096199",
            items: {},
            totalValue: 123,
            assignedBranchID: "assignedBranchID",
            assignedBranchName: "assignedBranchName",
            updatedBy: {
              smartID: "test",
              transactionTimestamp: 1681129441,
              userName: "test",
            },
            itemID: "123",
            pouchType: "cash",
            transactionID: "transactionIDts",
            status: "prepared",
          },
        ],
        availablePouchData: [
          {
            pouchID: "397250096199",
            items: {},
            totalValue: 123,
            assignedBranchID: "assignedBranchID",
            assignedBranchName: "assignedBranchName",
            updatedBy: {
              smartID: "test",
              transactionTimestamp: 1681129441,
              userName: "test",
            },
            itemID: "123",
            pouchType: "cash",
            transactionID: "transactionIDts",
            status: "prepared",
          },
        ],
        showAvailablePouches: false,
        failureCount: 0,
      },
    });
    expect(getByTestId("PouchDispatchScanner")).toBeTruthy();
  });

  it("show duplicate entry modal if entering wrong barcode", async () => {
    const user = setupUser();
    const barcode = "397250096199";
    const { getByTestId } = renderWithRedux(<PouchDispatchScanner />, {
      updatePouchDispatchList: {
        validatedData: [
          {
            pouchID: barcode,
            items: {},
            totalValue: 123,
            assignedBranchID: "assignedBranchID",
            assignedBranchName: "assignedBranchName",
            updatedBy: {
              smartID: "test",
              transactionTimestamp: 1681129441,
              userName: "test",
            },
            itemID: "123",
            pouchType: "cash",
            transactionID: "transactionIDts",
            status: "prepared",
          },
        ],
        availablePouchData: [
          {
            pouchID: "397250096199",
            items: {},
            totalValue: 123,
            assignedBranchID: "assignedBranchID",
            assignedBranchName: "assignedBranchName",
            updatedBy: {
              smartID: "test",
              transactionTimestamp: 1681129441,
              userName: "test",
            },
            itemID: "123",
            pouchType: "cash",
            transactionID: "transactionIDts",
            status: "prepared",
          },
        ],

        showAvailablePouches: false,

        failureCount: 0,
      },
    });
    const scanBtn = getByTestId("ScannerInputScanButton");
    const scannerInput = getByTestId("PouchDispatchScannerInput");
    await user.type(scannerInput, barcode);
    expect(scannerInput).toHaveValue(barcode);
    await user.click(scanBtn);
    expect(getByTestId(TEXT.CTTXT00023)).toBeTruthy();
  });
});
