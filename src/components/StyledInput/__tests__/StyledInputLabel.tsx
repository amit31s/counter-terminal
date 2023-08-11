import { render } from "@ct/common";
import { StyledInputLabel } from "../StyledInputLabel";

describe("styledInputLabel", () => {
  it("renders", () => {
    const { getByText } = render(<StyledInputLabel label="Test" containerProps={{}} />);
    expect(getByText("Test")).toBeInTheDocument();
  });
  describe("container prop variants", () => {
    describe("no prop color value", () => {
      it("renders text as default label color", () => {
        const { getByText } = render(<StyledInputLabel label="Test" containerProps={{}} />);
        expect(getByText("Test")).toHaveStyle({ color: "rgb(34, 34, 34)" });
      });
    });
    describe("props color is defined as black", () => {
      it("renders text as black", () => {
        const { getByText } = render(
          <StyledInputLabel label="Test" containerProps={{ color: "text.black" }} />,
        );
        expect(getByText("Test")).toHaveStyle({ color: "rgb(0, 0, 0)" });
      });
    });
  });
});
