import { PouchDataForDespatch } from "@ct/api/generator";
import { renderWithRedux } from "@ct/common";
import { ScannedPouchList } from "../ScannedPouchList";

describe("ScannedPouchList", () => {
  it("should render scanned pouch list screen", () => {
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
    const { getByTestId } = renderWithRedux(<ScannedPouchList pouchList={pouchList} />);
    expect(getByTestId("pouch-row-0")).toBeTruthy();
  });
});
