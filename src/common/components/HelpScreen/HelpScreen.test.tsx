import { renderWithRedux, setupUser } from "@ct/common/helpers";
import { HelpScreen } from "./HelpScreen";

const mockSetState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: (initial: boolean) => [initial, mockSetState],
}));

describe("HelpScreen", () => {
  const user = setupUser();
  it("should render help screen", async () => {
    const { getByTestId } = renderWithRedux(<HelpScreen showHelpScreen={true} />);
    const helpScreen = getByTestId("helpScreenLayout");
    expect(helpScreen).toBeTruthy();
  });

  it("test help hub button", async () => {
    const { findByTestId } = renderWithRedux(<HelpScreen showHelpScreen={true} />);
    const helpHubButton = await findByTestId("help_hub_test");
    await user.click(helpHubButton);
    expect(mockSetState).toHaveBeenCalled();
  });

  it("test maximise and minimize button", async () => {
    const { findByTestId } = renderWithRedux(<HelpScreen showHelpScreen={true} />);
    const maxMinButton = await findByTestId("max_min_button_test");
    await user.click(maxMinButton);
    expect(mockSetState).toHaveBeenCalled();
  });
});
