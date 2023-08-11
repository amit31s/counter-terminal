import { renderWithRedux } from "@ct/common";
import * as hooks from "@ct/common/hooks/homeScreenHooks/useVoidItemOrBasket";
import { RemoveItemButton } from "./RemoveItemButton";

describe("voidItemButton", () => {
  describe("component render", () => {
    it("renders with the correct button text", () => {
      const { getByText } = renderWithRedux(<RemoveItemButton />);
      const button = getByText("Remove item");
      expect(button).toBeInTheDocument();
    });
  });
  describe("button status", () => {
    describe("disabled", () => {
      it("renders the button as disabled", async () => {
        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: true,
          isItemVoidable: jest.fn(),
          isBasketVoidable: jest.fn(),
        });
        const { getByText } = renderWithRedux(<RemoveItemButton />);
        const button = getByText("Remove item");
        expect(button).toBeTruthy();
      });
    });
    describe("enabled", () => {
      it("renders the button as enabled", async () => {
        jest.spyOn(hooks, "useVoidItemOrBasket").mockReturnValue({
          isDisabled: false,
          isItemVoidable: jest.fn(),
          isBasketVoidable: jest.fn(),
        });
        const { getByText } = renderWithRedux(<RemoveItemButton />);
        const button = getByText("Remove item");
        expect(button).not.toHaveAttribute("aria-disabled", "true");
      });
    });
  });
});
