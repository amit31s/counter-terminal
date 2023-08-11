import { act, renderWithRedux, renderWithReduxAndStore } from "@ct/common";
import { toggleTouchKeyboardEnabled } from "@ct/common/state/touchKeyboard.slice";
import { StyledInput } from "@ct/components";

describe("Styled input component renders correctly", () => {
  it("renders a label if label text is provided", () => {
    const { getByTestId } = renderWithRedux(
      <StyledInput
        labelTestId="LabelTestId"
        inputProps={{ value: "", onChangeText: jest.fn() }}
        label={"Test Label"}
      />,
    );
    expect(getByTestId("LabelTestId")).toBeTruthy();
  });
  it("does not render a label if no label text provided", () => {
    const { queryByTestId } = renderWithRedux(
      <StyledInput labelTestId="LabelTestId" inputProps={{ value: "", onChangeText: jest.fn() }} />,
    );
    expect(queryByTestId("LabelTestId")).toBeFalsy();
  });

  it("renders an error if error text is provided", () => {
    const { getByTestId } = renderWithRedux(
      <StyledInput
        errorTestId="ErrorTestId"
        inputProps={{ value: "", onChangeText: jest.fn() }}
        error={"Test Error"}
      />,
    );
    expect(getByTestId("ErrorTestId")).toBeTruthy();
  });
  it("does not render an error if no error text provided", () => {
    const { queryByTestId } = renderWithRedux(
      <StyledInput errorTestId="ErrorTestId" inputProps={{ value: "", onChangeText: jest.fn() }} />,
    );
    expect(queryByTestId("ErrorTestId")).toBeFalsy();
  });

  it("renders a tooltip if tooltip text is provided", () => {
    const { getByTestId } = renderWithRedux(
      <StyledInput
        inputProps={{ value: "", onChangeText: jest.fn() }}
        label="Test Label"
        tooltip="Test Tooltip"
      />,
    );
    expect(getByTestId("TooltipTriggerTestId")).toBeTruthy();
  });

  it("does not render a tooltip if no tooltip text is provided", () => {
    const { queryByTestId } = renderWithRedux(
      <StyledInput inputProps={{ value: "", onChangeText: jest.fn() }} label="Test Label" />,
    );
    expect(queryByTestId("TooltipTriggerTestId")).toBeFalsy();
  });

  it("renders a label and an error if both have text provided", () => {
    const { getByTestId } = renderWithRedux(
      <StyledInput
        inputProps={{ value: "", onChangeText: jest.fn() }}
        label="Test Label"
        labelTestId="LabelTestId"
        error="Test Error"
        errorTestId="ErrorTestId"
      />,
    );
    expect(getByTestId("LabelTestId")).toBeTruthy();
    expect(getByTestId("ErrorTestId")).toBeTruthy();
  });

  it("enables/disables touch keyboard based on flag", () => {
    const {
      store,
      rendered: { getByRole },
    } = renderWithReduxAndStore(
      <StyledInput
        inputProps={{ value: "", onChangeText: jest.fn() }}
        label="Test Label"
        labelTestId="LabelTestId"
        error="Test Error"
        errorTestId="ErrorTestId"
      />,
      { touchKeyboard: { enabled: false } },
    );
    expect(getByRole("textbox")).toHaveAttribute("virtualkeyboardpolicy", "manual");
    act(() => {
      store.dispatch(toggleTouchKeyboardEnabled());
    });
    expect(getByRole("textbox")).toHaveAttribute("virtualkeyboardpolicy", "auto");
  });
});
