import { render, setupUser } from "@ct/common/helpers/test-utils";
import { StyledButton, StyledButtonSize, StyledButtonType } from "@ct/components";

describe("Styled button component renders correctly", () => {
  it("renders something", () => {
    const customStyle = { width: "20%" };
    const { getByTestId } = render(
      <StyledButton testID="ButtonTestId" label="Test Button" styles={[customStyle]} />,
    );
    expect(getByTestId("ButtonTestId")).toBeTruthy();
  });

  it("renders disable button", () => {
    const { getByTestId } = render(
      <StyledButton testID="ButtonTestId" label="Test Disable Button" isDisabled />,
    );
    expect(getByTestId("ButtonTestId")).toBeTruthy();
  });

  it("calls it's callback", async () => {
    const user = setupUser();
    const onPress = jest.fn();
    const { getByTestId } = render(
      <StyledButton testID="ButtonTestId" label="Test Button" onPress={onPress} size="slim" />,
    );
    await user.click(getByTestId("ButtonTestId"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  const buttonTypes: StyledButtonType[] = [
    "primary",
    "secondary",
    "tertiary",
    "invertedPrimary",
    "invertedSecondary",
  ];
  const buttonSizes: StyledButtonSize[] = ["default", "slim"];

  buttonTypes.forEach((type) => {
    buttonSizes.forEach((size) => {
      it(`renders the ${size} ${type} variant correctly`, async () => {
        const view = render(
          <StyledButton testID="ButtonTestId" label="Test Button" type={type} size={size} />,
        );
        expect(view.baseElement).toMatchSnapshot();
      });
    });
  });
});
