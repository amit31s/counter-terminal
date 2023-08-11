import { renderWithRedux } from "@ct/common";
import { CashDrawerScreen } from "./CashDrawerScreen";

describe("CashDrawerScreen", () => {
  it("should render cash drawer screen", () => {
    const { getByText } = renderWithRedux(<CashDrawerScreen />);
    expect(getByText("Associate cash drawer")).toBeTruthy();
  });
});
