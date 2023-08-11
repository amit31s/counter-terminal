import { render, setupUser } from "@ct/common";
import { CustomButton } from "../CustomButton";

describe("Custom Button", () => {
  it("should render custom button with loader", () => {
    const { getByTestId } = render(<CustomButton text="mock-title" buttonId="mock-id" isLoading />);
    expect(getByTestId("mock-id")).toBeTruthy();
  });

  it("should render custom button with isdisabled", async () => {
    const user = setupUser();
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <CustomButton text="mock-title" buttonId="mock-id" isDisabled onChange={handleChange} />,
    );
    await user.click(getByTestId("mock-id"));
    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("should render custom button", async () => {
    const user = setupUser();
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <CustomButton buttonId="mock-id" onChange={handleChange}>
        <div />
      </CustomButton>,
    );
    await user.click(getByTestId("mock-id"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
