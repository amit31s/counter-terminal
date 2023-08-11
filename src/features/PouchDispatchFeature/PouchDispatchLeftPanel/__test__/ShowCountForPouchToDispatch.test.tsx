import { PouchDataForDespatch } from "@ct/api/generator/model/pouchDataForDespatch";
import { renderWithRedux } from "@ct/common";
import * as selector from "@ct/common/hooks/useAppSelector";
import { Message, ShowCountForPouchToDispatch } from "../ShowCountForPouchToDispatch";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("message", () => {
  it("works", () => {
    jest.spyOn(selector, "useAppSelector").mockReturnValueOnce([]);
    const { getByText } = renderWithRedux(<Message />);
    expect(getByText("There are NO pouches available for dispatch.")).toBeInTheDocument();
  });

  it("returns correct message for singular pouch", () => {
    const pouchList: PouchDataForDespatch[] = [
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
    ];
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ availablePouchData: pouchList });
    const { container } = renderWithRedux(<Message />);
    expect(container).toHaveTextContent(
      "1 pouch is available for dispatch. Please retreive pouch from safe and scan to start dispatch.",
    );
  });

  it("returns correct message for multiple pouches", () => {
    const pouchList: PouchDataForDespatch[] = [
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
    ];
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ availablePouchData: pouchList });
    const { container } = renderWithRedux(<Message />);
    expect(container).toHaveTextContent(
      "2 pouches are available for dispatch. Please retreive pouches from safe and scan to start dispatch.",
    );
  });
});

describe("ShowCountForPouchToDispatch", () => {
  it("should render message if isLoadingAvailable pouch equal to false", () => {
    const pouchList: PouchDataForDespatch[] = [
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
    ];
    jest.spyOn(selector, "useAppSelector").mockReturnValueOnce([]);
    jest.spyOn(selector, "useAppSelector").mockReturnValue({ availablePouchData: pouchList });
    const { container } = renderWithRedux(<ShowCountForPouchToDispatch />);
    expect(container).toHaveTextContent(
      "1 pouch is available for dispatch. Please retreive pouch from safe and scan to start dispatch.",
    );
  });

  it("should render empty fragment if isloadingAvailable pouch equal to true", () => {
    jest.spyOn(selector, "useAppSelector").mockReturnValueOnce([{ id: `LOAD_POUCH_TO_DISPATCH` }]);
    const { container } = renderWithRedux(<ShowCountForPouchToDispatch />);
    expect(container.firstChild).toBeEmpty();
  });
});
