import { renderWithRedux } from "@ct/common";
import { CashTransferScreen } from "./CashTransferScreen";

describe("CashTransferScreen", () => {
  it("should render cash transfer screen", () => {
    const { getByText } = renderWithRedux(<CashTransferScreen />);
    expect(getByText("Cash transfer out")).toBeTruthy();
  });
});
