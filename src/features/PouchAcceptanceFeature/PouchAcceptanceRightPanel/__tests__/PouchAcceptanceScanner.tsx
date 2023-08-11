import { renderWithRedux, setupUser } from "@ct/common";
import { TEXT } from "@ct/constants";
import { PouchAcceptanceScanner } from "../PouchAcceptanceScanner";

describe("Render PouchAcceptanceScanner", () => {
  it("PouchAcceptanceScanner rendered successfully", () => {
    const { getByTestId } = renderWithRedux(<PouchAcceptanceScanner />);
    expect(getByTestId("PouchAcceptanceScanner")).toBeTruthy();
  });

  it("show duplicate entry modal if entering wrong barcode", async () => {
    const user = setupUser();
    const barcode = "397250096199";
    const { getByTestId } = renderWithRedux(<PouchAcceptanceScanner />, {
      pouchAcceptanceList: {
        data: null,
        validatedData: [
          {
            pouchID: barcode,
            items: {},
            totalValue: 0,
            assignedBranchID: "assignedBranchID",
            assignedBranchName: "assignedBranchName",
            itemID: "123",
            isBranchValid: "test",
            isPouchValid: "test",
            isPouchValueAssociated: "test",
            pouchType: "cash",
            status: "expected",
            transactionID: "test",
            updatedBy: {},
            deliveredBranchID: "test",
          },
        ],
        showAvailablePouches: false,
        availablePouchData: [],
      },
    });
    const scanBtn = getByTestId("ScannerInputScanButton");
    const scannerInput = getByTestId("PouchAcceptanceScannerInput");
    await user.type(scannerInput, barcode);
    expect(scannerInput).toHaveValue(barcode);
    await user.click(scanBtn);
    expect(getByTestId(TEXT.CTTXT00023)).toBeTruthy();
  });

  it("test duplicate pouch available ", () => {
    const barcode = "397212345678";
    const pouchAcceptanceData = {
      validatedData: [
        {
          pouchID: "397212345678",
          items: {},
          valueInPence: 0,
          assignedBranchID: "assignedBranchID",
          assignedBranchName: "assignedBranchName",
          itemID: "123",
          isBranchValid: "test",
          isPouchValid: "test",
          isPouchValueAssociated: "test",
          pouchType: "cash",
          status: "expected",
          transactionID: "test",
          updatedBy: {},
          deliveredBranchID: "test",
        },
        {
          pouchID: "397212345670",
          items: {},
          valueInPence: 0,
          assignedBranchID: "assignedBranchID",
          assignedBranchName: "assignedBranchName",
          itemID: "123",
          isBranchValid: "test",
          isPouchValid: "test",
          isPouchValueAssociated: "test",
          pouchType: "cash",
          status: "expected",
          transactionID: "test",
          updatedBy: {},
          deliveredBranchID: "test",
        },
      ],
    };
    const validatedData = pouchAcceptanceData.validatedData;
    const foundItem = validatedData.find((item) => item.pouchID === barcode);
    expect(foundItem !== undefined).toEqual(true);
  });

  it("test duplicate pouch not available", () => {
    const barcode = "397212345678";
    const pouchAcceptanceData = {
      validatedData: [
        {
          pouchID: "397212345679",
          items: {},
          valueInPence: 0,
          assignedBranchID: "assignedBranchID",
          assignedBranchName: "assignedBranchName",
          itemID: "123",
          isBranchValid: "test",
          isPouchValid: "test",
          isPouchValueAssociated: "test",
          pouchType: "cash",
          status: "expected",
          transactionID: "test",
          updatedBy: {},
          deliveredBranchID: "test",
        },
        {
          pouchID: "397212345670",
          items: {},
          valueInPence: 0,
          assignedBranchID: "assignedBranchID",
          assignedBranchName: "assignedBranchName",
          itemID: "123",
          isBranchValid: "test",
          isPouchValid: "test",
          isPouchValueAssociated: "test",
          pouchType: "cash",
          status: "expected",
          transactionID: "test",
          updatedBy: {},
          deliveredBranchID: "test",
        },
      ],
    };
    const validatedData = pouchAcceptanceData.validatedData;
    const foundItem = validatedData.find((item) => item.pouchID === barcode);
    expect(foundItem !== undefined).toEqual(false);
  });
});
