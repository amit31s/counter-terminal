import { renderWithRedux } from "@ct/common";
import { SCREENS } from "@ct/constants";
import { CashDrawerLeftPanel } from "../CashDrawerLeftPanel";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: SCREENS.CASH_DRAWER,
  }),
}));

describe("Cash Drawer Left Panel Layout", () => {
  it("should render cash drawer left panel layout", async () => {
    const { getByTestId } = renderWithRedux(<CashDrawerLeftPanel />);
    expect(getByTestId("cashdrawer_text1")).toBeTruthy();
    expect(getByTestId("cashdrawer_text2")).toBeTruthy();
  });
});
