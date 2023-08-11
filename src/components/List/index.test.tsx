import { render, setupUser } from "@ct/common";
import { TEXT } from "@ct/constants";
import List from ".";

describe("List Component Functionality", () => {
  it("renders a list successfully", async () => {
    const mockListData = [
      {
        counterID: "mock-CounterID-1",
        counterName: "mock-counterName-1",
        accountingLocationID: "mock-accountingLocationID-1",
        accountingLocationName: "mock-accountingLocationName-1",
        entityType: "mock-entityType-1",
      },
      {
        counterID: "mock-CounterID-2",
        counterName: "mock-counterName-2",
        accountingLocationID: "mock-accountingLocationID-2",
        accountingLocationName: "mock-accountingLocationName-2",
        entityType: "mock-entityType-2",
      },
    ];
    const mockParentCallback = jest.fn();

    const user = setupUser();
    const { getByTestId, getByText } = render(
      <List list={mockListData} selectedLocationCallback={mockParentCallback} />,
    );

    expect(getByText(TEXT.CTTXT00065)).toBeTruthy();
    expect(getByTestId("post-row-0")).toHaveTextContent(mockListData[0].accountingLocationName);
    expect(getByTestId("post-row-1")).toHaveTextContent(mockListData[1].accountingLocationName);

    await user.click(getByTestId("post-row-0"));
    expect(mockParentCallback).toHaveBeenCalledTimes(1);
    expect(mockParentCallback).toHaveBeenCalledWith(mockListData[0]);
  });
});
