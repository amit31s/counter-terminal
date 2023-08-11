import { renderWithRedux, setupUser } from "@ct/common/helpers/test-utils";
import { SubmitPouchButton } from "./SubmitPouchButton";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const submit = jest.fn();

describe("Render SubmitPouchButton component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Trigger submit on click of confirm button", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<SubmitPouchButton disabled={false} submit={submit} />);
    expect(getByTestId("confirm")).toBeTruthy();
    await user.click(getByTestId("confirm"));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("Show cancel button", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<SubmitPouchButton disabled={false} submit={submit} />);
    expect(getByTestId("cancel")).toBeTruthy();
    await user.click(getByTestId("cancel"));
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });

  it("Disable confirm button when passing disabled=true ", () => {
    const { getByTestId } = renderWithRedux(<SubmitPouchButton disabled={true} submit={submit} />);
    expect(getByTestId("confirm")).toBeTruthy();
    expect(getByTestId("confirm")).toHaveAttribute("aria-disabled", "true");
  });
});
