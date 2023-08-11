import { render } from "@ct/common";
import { StyledInputError } from "../StyledInputError";

describe("styledInputLabel", () => {
  it("renders", () => {
    const { getByText } = render(<StyledInputError error="Error" />);
    expect(getByText("Error")).toBeInTheDocument();
  });

  it("renders text with correct color", () => {
    const { getByText } = render(<StyledInputError error="Test" />);
    expect(getByText("Test")).toHaveStyle({ color: "rgb(178, 1, 1)" });
  });
});
