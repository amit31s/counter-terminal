import { render } from "@ct/common";
import { MaterialSymbol } from "..";
const SIZES = ["small", "medium", "large"] as const;
const COLORS = [undefined, "pink", "#FFF000"] as const;

describe("Material Symbol", () => {
  it("renders with the expected styles", () => {
    const view = render(
      <>
        {SIZES.map((size) =>
          COLORS.map((color) => <MaterialSymbol name="home" size={size} color={color} />),
        )}
      </>,
    );
    expect(view.baseElement).toMatchSnapshot();
  });
});
