import { renderWithRedux, setupUser } from "@ct/common";
import { SCREENS, STRING_CONSTANTS } from "@ct/constants";
import { CashDrawerRightPanel } from "../CashDrawerRightPanel";

const mockAssosciatedCashDrawerCounterHook = jest.fn();
jest.mock("@ct/api/generator", () => ({
  useAssociateCashDrawerCounterHook: () => mockAssosciatedCashDrawerCounterHook,
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockOnLine = jest.spyOn(navigator, "onLine", "get");

describe("cashDrawerRighPanel", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("success cases", () => {
    it("navigates away when cash drawer assosciates successfully", async () => {
      const user = setupUser();
      const { getByRole, getByLabelText } = renderWithRedux(<CashDrawerRightPanel />);
      await user.type(getByRole("textbox"), "2314010-CD-215-1676526586");
      await user.click(getByLabelText("Enter"));
      expect(mockedNavigate).toHaveBeenCalledWith(SCREENS.HOME, {
        state: { from: SCREENS.CASH_DRAWER },
      });
    });
  });

  describe("error cases", () => {
    it("modal shows network error message", async () => {
      const user = setupUser();
      mockAssosciatedCashDrawerCounterHook.mockImplementation(() => {
        throw new Error();
      });
      mockOnLine.mockReturnValue(false);
      const { getByRole, getByLabelText, getByText } = renderWithRedux(<CashDrawerRightPanel />);
      await user.type(getByRole("textbox"), "2314010-CD-215-1676526586");
      await user.click(getByLabelText("Enter"));
      expect(
        getByText(STRING_CONSTANTS.CommitFailureModal.internetFailureContent),
      ).toBeInTheDocument();
    });

    it("modal shows something went wrong message ", async () => {
      const user = setupUser();
      mockAssosciatedCashDrawerCounterHook.mockImplementation(() => {
        throw new Error();
      });
      mockOnLine.mockReturnValue(true);
      const { getByRole, getByLabelText, getByText } = renderWithRedux(<CashDrawerRightPanel />);
      await user.type(getByRole("textbox"), "2314010-CD-215-1676526586");
      await user.click(getByLabelText("Enter"));
      expect(getByText(STRING_CONSTANTS.messages.somethingWentWrong)).toBeInTheDocument();
    });
  });
});
