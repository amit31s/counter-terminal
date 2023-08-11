import { PouchDataForDespatch } from "@ct/api/generator/model/pouchDataForDespatch";
import { renderWithRedux } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import { InitialPouchDispatchState } from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { PouchDispatchLeftPanel } from "../PouchDispatchLeftPanel";

afterEach(() => {
  jest.clearAllMocks();
});

describe("PouchDispatchLeftPanel", () => {
  const expectedOutput = [{ pouchID: "B" }] as unknown as PouchDataForDespatch[];
  const updatePouchDispatchList: InitialPouchDispatchState = {
    validatedData: expectedOutput,
    availablePouchData: [
      {
        items: {},
        assignedBranchID: "2314010",
        assignedBranchName: "2314010",
        itemID: "6286",
        pouchID: "564831000004",
        pouchType: "cash",
        status: "prepared",
        updatedBy: {
          smartID: "test",
          transactionTimestamp: 1681129441,
          userName: "test",
        },
        totalValue: 0,
        transactionID: "transactionID",
      },
    ],
    showAvailablePouches: true,
    failureCount: 0,
  };
  it("should render scannedPouchList component with pouchID if scanned pouch validated data has length", () => {
    const useSelectorMock = jest.spyOn(selector, "useAppSelector");
    useSelectorMock.mockReturnValueOnce(updatePouchDispatchList);
    const { container } = renderWithRedux(<PouchDispatchLeftPanel />);
    expect(container).toHaveTextContent(`B`);
  });

  it("should render no pouch scanned component ", () => {
    const useSelectorMock = jest.spyOn(selector, "useAppSelector");
    useSelectorMock.mockReturnValueOnce([updatePouchDispatchList]);
    const { container } = renderWithRedux(<PouchDispatchLeftPanel />);
    expect(container).toHaveTextContent(
      `Scan or enter ACC Card barcode in the text box on the right.`,
    );
  });

  it("should render showCountForPouchToDispatch component if validated data has no length but accCardScanned equals true", () => {
    const useSelectorMock = jest.spyOn(selector, "useAppSelector");
    useSelectorMock.mockReturnValueOnce([]);
    useSelectorMock.mockReturnValueOnce({ scanned: true });
    const { getByText } = renderWithRedux(<PouchDispatchLeftPanel />);
    expect(getByText("There are NO pouches available for dispatch.")).toBeInTheDocument();
  });
});
