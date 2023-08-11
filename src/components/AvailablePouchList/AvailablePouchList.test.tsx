import { renderWithRedux, setupUser } from "@ct/common";
import AvailablePouchList from "./index";

describe("AvailablePouchList", () => {
  it("should render available pouch list with data", async () => {
    const user = setupUser();
    const { getByText, getByTestId } = renderWithRedux(
      <AvailablePouchList
        parentCallback={jest.fn()}
        availablePouches={[
          {
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
          {
            pouchID: "397212345670",
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
          {
            pouchID: "397212345670",
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
        ]}
      />,
    );
    expect(getByText("Pouch Type")).toBeTruthy();
    expect(getByTestId("post-row-0")).toBeTruthy();
    await user.click(getByTestId("post-row-0"));
    expect(getByTestId("post-row-1")).toBeTruthy();
    await user.click(getByTestId("post-row-1"));
  });
});
