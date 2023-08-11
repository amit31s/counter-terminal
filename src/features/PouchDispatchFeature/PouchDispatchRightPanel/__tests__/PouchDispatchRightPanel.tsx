import { renderWithRedux } from "@ct/common/helpers";
import { ScannedAccCardState } from "@ct/common/state/pouchDispatch/accCardFeature.slice";
import { InitialPouchDispatchState } from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { PouchDispatchRightPanel } from "../PouchDispatchRightPanel";

const updateAccCard: ScannedAccCardState = {
  barcode: "",
  scanned: true,
  failureCount: 0,
};

const updatePouchDispatchList: InitialPouchDispatchState = {
  validatedData: [],
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
describe("PouchDispatchRightPanel", () => {
  it("PouchDispatchRightPanel render test", async () => {
    const { getByTestId } = renderWithRedux(<PouchDispatchRightPanel />, {
      updateAccCard,
      updatePouchDispatchList,
    });
    expect(getByTestId("availablePouch")).toBeTruthy();
  });
});
