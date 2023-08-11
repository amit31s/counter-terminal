import { renderWithRedux, setupUser, waitFor } from "@ct/common";
import { CashTransferLeftPanel } from "../CashTransferLeftPanel";
import { authMock } from "@ct/utils/MockData/reduxMock";

const mockGetAssociationUnassociationDetailsHook = jest.fn();
jest.mock(
  "@ct/api/generator/endpoints/association-unassociation-details/association-unassociation-details",
  () => {
    const originalModule = jest.requireActual(
      "@ct/api/generator/endpoints/association-unassociation-details/association-unassociation-details",
    );
    originalModule.useGetAssociationUnassociationDetailsHook = () =>
      mockGetAssociationUnassociationDetailsHook;
    return originalModule;
  },
);

const mockData = {
  safe: {
    accountingLocationID: "S01",
    accountingLocationName: "Safe 1",
    accountingLocationType: "safe",
  },
  associated: [
    {
      accountingLocationID: "C01",
      accountingLocationName: "Cash Drawer 1",
      accountingLocationType: "cashDrawer",
      counterID: "35",
      counterName: "Counter 35",
    },
  ],
  unassociated: [
    {
      accountingLocationID: "C02",
      accountingLocationName: "Cash Drawer 2",
      accountingLocationType: "cashDrawer",
    },
  ],
};

describe("CashTransferLeftPanel", () => {
  it("should show list of drawer when success", async () => {
    const user = setupUser();
    mockGetAssociationUnassociationDetailsHook.mockImplementation(() => {
      return mockData;
    });
    const { getByText } = renderWithRedux(<CashTransferLeftPanel />, {
      auth: authMock,
    });
    expect(getByText("Counter - 56")).toBeInTheDocument();
    await waitFor(async () => {
      expect(getByText("Safe 1")).toBeInTheDocument();
      await user.click(getByText("Safe 1"));
    });
  });
  it("should not show list of drawer when failed", () => {
    mockGetAssociationUnassociationDetailsHook.mockImplementation(() => {
      throw new Error();
    });
    const { getByText, queryByTestId } = renderWithRedux(<CashTransferLeftPanel />, {
      auth: authMock,
    });
    expect(getByText("Counter - 56")).toBeInTheDocument();
    expect(queryByTestId("post-row-1")).not.toBeTruthy();
  });
});
