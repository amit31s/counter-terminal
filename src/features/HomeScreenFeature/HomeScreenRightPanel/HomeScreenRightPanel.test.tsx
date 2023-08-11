import { renderWithRedux } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { basketItemMock } from "@ct/utils/MockData";
import { HomeScreenRightPanel } from "./HomeScreenRightPanel";

describe("Testing HomeScreenRightPanel", () => {
  test("reset home screen right panel", () => {
    const { getByTestId } = renderWithRedux(<HomeScreenRightPanel />, {
      updateNumpadFlagStatus: {
        flag: false,
      },
      updateBasket: {
        items: [],
        customerToPay: 0,
        postOfficeToPay: 0,
        basketValue: 0,
        fulfilledAmountToNbit: 0,
        postOfficeTenderingAmount: 0,
        basketId: "",
      },
    });
    expect(getByTestId("empty-view")).toBeTruthy();
  });
  test("reset home screen right panel with quantity modal", () => {
    const basketItems = basketItemMock();
    const { getByText } = renderWithRedux(<HomeScreenRightPanel />, {
      updateNumpadFlagStatus: {
        flag: true,
      },
      updateBasket: {
        items: basketItems,
        customerToPay: 0,
        postOfficeToPay: 0,
        basketValue: 0,
        fulfilledAmountToNbit: 0,
        postOfficeTenderingAmount: 0,
        basketId: "",
      },
    });
    expect(getByText(stringConstants.ItemList.Title)).toBeTruthy();
  });
});
