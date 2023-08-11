import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { rdcPouchListForAcceptance } from "@ct/utils/MockData/rdcPouchListForAcceptance";
import { PouchAcceptanceRightPanel } from "../pouchAcceptanceRightPanel";

jest.mock("../useGetAvailablePouchForAcceptance", () => {
  return {
    useGetAvailablePouchForAcceptance: jest
      .fn()
      .mockReturnValue({ availablePouch: rdcPouchListForAcceptance }),
  };
});

describe("Render PouchAcceptanceRightPanel", () => {
  it("pouch acceptance right panel rendered successfully", () => {
    const { getByTestId } = renderWithRedux(<PouchAcceptanceRightPanel />);
    expect(getByTestId("PouchAcceptanceScannerInput")).toBeTruthy();
  });

  it("pouch acceptance right panel rendered successfully with available pouch", async () => {
    const user = setupUser();
    const { getByText, getByTestId } = renderWithRedux(<PouchAcceptanceRightPanel />, {
      pouchAcceptanceList: {
        data: null,
        validatedData: [],
        showAvailablePouches: true,
        availablePouchData: [],
      },
    });
    expect(getByText(stringConstants.Pouch.BarCode)).toBeTruthy();
    expect(getByTestId("post-row-0")).toBeTruthy();
    await user.click(getByTestId("post-row-0"));
  });

  it("pouch acceptance right panel rendered successfully with zero value pouch", () => {
    const { getByText } = renderWithRedux(<PouchAcceptanceRightPanel />, {
      pouchAcceptanceList: {
        data: {
          pouchID: "397212345678",
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
        validatedData: [],
        showAvailablePouches: true,
        availablePouchData: [],
      },
    });
    expect(getByText(stringConstants.Pouch.NoAssociationWithPouch)).toBeTruthy();
  });
});
