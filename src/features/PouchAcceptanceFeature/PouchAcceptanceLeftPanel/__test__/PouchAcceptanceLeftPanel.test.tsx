import { PouchType } from "@ct/api/generator";
import { renderWithRedux } from "@ct/common";
import * as hooks from "../../useGetPouchForAcceptance";
import { PouchAcceptanceLeftPanel } from "../pouchAcceptanceLeftPanel";

describe("pouchAcceptanceLeftPanel", () => {
  beforeEach(() => jest.clearAllMocks());
  it("renders scannedPouchList component if there is validated data", () => {
    const mockReturn = {
      isBranchValid: "true",
      isPouchValid: "true",
      isPouchValueAssociated: "true",
      pouchID: "pouchID-1234",
      pouchType: PouchType.cash,
      transactionID: "transactionID",
      updatedBy: {},
      status: "expected" as const,
      items: {},
    };
    jest
      .spyOn(hooks, "useGetPouchForAcceptance")
      .mockReturnValue({ availablePouchData: [], validatedData: [mockReturn] });
    const { getByText } = renderWithRedux(<PouchAcceptanceLeftPanel />);
    expect(getByText("pouchID-1234")).toBeInTheDocument();
  });

  it("renders no pouch scanned component if no validated data", () => {
    jest
      .spyOn(hooks, "useGetPouchForAcceptance")
      .mockReturnValue({ availablePouchData: [], validatedData: [] });
    const { getByText } = renderWithRedux(<PouchAcceptanceLeftPanel />);
    expect(getByText("Scan or enter pouch barcode in")).toBeInTheDocument();
    expect(getByText("the text box on the right.")).toBeInTheDocument();
  });
});
