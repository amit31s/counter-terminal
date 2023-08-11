import { renderWithRedux, setupUser } from "@ct/common";
import { CashTransferRightPanel } from "../CashTransferRightPanel";
import { BUTTON, TEXT } from "@ct/constants";

describe("CashTransferRightPanel", () => {
  it("should render select cash drawer", () => {
    const { getByTestId } = renderWithRedux(<CashTransferRightPanel />, {
      cashTransfer: { selectedItem: { entityType: "" }, transferred: false },
    });
    expect(getByTestId("test-select-cash-location-message")).toBeTruthy();
  });
  it("should render cash transfer success", async () => {
    const { getByText } = renderWithRedux(<CashTransferRightPanel />, {
      cashTransfer: {
        selectedItem: {
          entityType: "cash_drawer",
          accountingLocationID: "C02",
          accountingLocationName: "Cash Drawer 2",
        },
        transferred: true,
      },
    });
    const user = setupUser();
    expect(getByText(TEXT.CTTXT00067)).toBeTruthy();
    const backToHomeButton = getByText(BUTTON.CTBTN0002);
    expect(backToHomeButton).toBeTruthy();
    await user.click(backToHomeButton);
  });
  it("should render cash input layout", async () => {
    const { getByTestId, getByRole } = renderWithRedux(<CashTransferRightPanel />, {
      cashTransfer: {
        selectedItem: {
          entityType: "cash_drawer",
          accountingLocationID: "C02",
          accountingLocationName: "Cash Drawer 2",
        },
        transferred: false,
      },
    });
    const user = setupUser();
    expect(getByTestId("test-cash-input")).toBeTruthy();
    await user.type(getByRole("textbox"), "10");

    const cancelButton = getByTestId(BUTTON.CTBTN0006);
    expect(cancelButton).toBeTruthy();
    await user.click(cancelButton);

    const confirmButton = getByTestId("Confirm");
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton);
  });
});
