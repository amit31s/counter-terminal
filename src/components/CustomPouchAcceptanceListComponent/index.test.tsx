import { PouchAcceptanceDetails } from "@ct/api/generator";
import { render } from "@ct/common";
import CustomPouchAcceptanceListComponent from "./index";

describe("Pouch Acceptance List", () => {
  it("Pouch List render correctly", async () => {
    const data: PouchAcceptanceDetails[] = [];
    const PouchList = () => (
      <CustomPouchAcceptanceListComponent parentdata={data} onDeleteItem={jest.fn()} />
    );
    const { queryByTestId, getAllByText, getByTestId } = render(<PouchList />);
    expect(getByTestId("testFlatList")).toBeTruthy();
    expect(queryByTestId("pouch-row-0")).toBeNull();
    expect(getAllByText("No Data Found")).toBeTruthy();
  });

  it("Pouch List elements render correctly", async () => {
    const data: PouchAcceptanceDetails = {
      items: {
        "657": {
          itemID: "657",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 1000,
          itemValue: 200000,
          itemQuantity: 200,
        },
        "658": {
          itemID: "658",
          materialType: "NOTE",
          currency: "GBP",
          denomination: 500,
          itemValue: 50000,
          itemQuantity: 100,
        },
      },
      isBranchValid: "",
      isPouchValid: "",
      isPouchValueAssociated: "",
      pouchID: "",
      pouchType: "cash",
      status: "expected",
      transactionID: "",
      updatedBy: {},
    };
    const { getByTestId } = render(
      <CustomPouchAcceptanceListComponent parentdata={[data]} onDeleteItem={jest.fn()} />,
    );
    expect(getByTestId("testFlatList")).toBeTruthy();
    expect(getByTestId("pouch-row-0")).toBeTruthy();
  });
});
