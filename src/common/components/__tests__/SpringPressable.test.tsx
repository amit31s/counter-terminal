import { render, setupUser } from "@ct/common";
import { SpringPressable } from "../SpringPressable";

describe("Spring Pressable", () => {
  it("should render spring pressable with testID", async () => {
    const user = setupUser();
    const handleChange = jest.fn();
    const { getByTestId } = render(<SpringPressable testID="mock-id" onChange={handleChange} />);
    expect(getByTestId("mock-id")).toBeTruthy();
    await user.click(getByTestId("mock-id"));
    expect(handleChange).toBeCalledTimes(1);
  });
  it("should render spring pressable with buttonId", async () => {
    const user = setupUser();
    const handleChange = jest.fn();
    const { getByTestId } = render(<SpringPressable buttonId="mock-id" onChange={handleChange} />);
    expect(getByTestId("mock-id")).toBeTruthy();
    await user.click(getByTestId("mock-id"));
    expect(handleChange).toBeCalledTimes(1);
  });
});
