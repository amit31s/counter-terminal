import { STRING_CONSTANTS } from "@ct/constants";
import { basketItemMock } from "@ct/utils/MockData";
import * as homeScreenModalButtons from "./HomeScreenModalButtons";

const mockedNavigate = jest.fn();

describe("testing HomeScreenModalButtons", () => {
  const mockItems = basketItemMock();
  const moreMenuButtonsArgs = {
    navigate: mockedNavigate,
    setshowMorePopup: jest.fn(),
    existsSuspendBasket: false,
    handleDissociateCashDrawer: jest.fn(),
    handleReprintReceipt: jest.fn(),
    basketItems: mockItems,
    suspendBasketClicked: jest.fn(),
    recallBasketClicked: jest.fn(),
    showLicencesClick: jest.fn(),
  };
  test("suspend basket button should disabled if commited item count greater then zero", () => {
    const buttons = homeScreenModalButtons.moreMenuButtons(moreMenuButtonsArgs, "mockBranchId", 1);
    const suspendButton = buttons.filter(
      (button) => button.name === STRING_CONSTANTS.Button.suspendBasket,
    );
    expect(suspendButton[0].isDisabled).toBe(true);
  });
  test("suspend basket button should enabled if no item commited", () => {
    const buttons = homeScreenModalButtons.moreMenuButtons(moreMenuButtonsArgs, "mockBranchId", 0);
    const suspendButton = buttons.filter(
      (button) => button.name === STRING_CONSTANTS.Button.suspendBasket,
    );
    expect(suspendButton[0].isDisabled).toBe(false);
  });
});
