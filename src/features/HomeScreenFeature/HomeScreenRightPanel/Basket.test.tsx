import { renderWithRedux } from "@ct/common";
import { Basket } from "./Basket";

describe("Testing Basket componemt", () => {
  it("Should Basket componemt render successfully", () => {
    const { getByTestId } = renderWithRedux(<Basket />, {
      updateQuantityFlag: {
        flag: true,
      },
    });
    expect(getByTestId("updateQuantityView")).toBeTruthy();
  });
});
