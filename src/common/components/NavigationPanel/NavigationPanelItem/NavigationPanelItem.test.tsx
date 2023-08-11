import { renderWithRedux, setupUser } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { stringConstants } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces";
import { NavigationPanelItem } from "./NavigationPanelItem";
const mockSetState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: (initial: boolean) => [initial, mockSetState],
}));

describe("Navigation Panel Item", () => {
  const user = setupUser();
  const mockItemPressed = jest.fn();
  it("should render navigation panel item", async () => {
    const { getByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[0][0].items[0]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
    );
    const reversalText = getByTestId("navigation_panel_item_Reversal");
    expect(reversalText.textContent).toContain("Reversal");
  });

  it("should render navigation panel item touchable", async () => {
    const mockBasket: IbasketItem[] = [
      {
        id: "1234",
        total: 1234,
        price: 1234,
        commitStatus: CommitStatus.notInitiated,
        quantity: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        source: "nbit",
        additionalItemsValue: 0,
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = mockBasket;
    const { findByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[0][0].items[0]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
      {
        updateBasket,
      },
    );
    const basketTouchable = await findByTestId("navigation_panel_item_Reversal");
    await user.click(basketTouchable);
    expect(mockSetState).toHaveBeenCalled();
  });

  it("should render navigation panel item touchable with Devices title", async () => {
    const mockBasket: IbasketItem[] = [
      {
        id: "1234",
        total: 1234,
        price: 1234,
        commitStatus: CommitStatus.notInitiated,
        quantity: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        source: "nbit",
        additionalItemsValue: 0,
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = mockBasket;
    const { findByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[2][1].items[1]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
      {
        updateBasket,
      },
    );
    const basketTouchable = await findByTestId("navigation_panel_item_Devices");
    await user.click(basketTouchable);
    expect(mockSetState).toHaveBeenCalled();
  });

  it("suspend basket button should be display if item not initiated ", async () => {
    const mockBasket: IbasketItem[] = [
      {
        id: "1234",
        total: 1234,
        price: 1234,
        commitStatus: CommitStatus.notInitiated,
        quantity: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        source: "nbit",
        additionalItemsValue: 0,
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = mockBasket;

    const { findByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[0][0].items[1]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
      {
        updateBasket,
      },
    );

    const suspendBasketButton = await findByTestId("navigation_panel_item_Suspend basket");
    expect(suspendBasketButton.textContent).toContain("Suspend basket");
    await user.click(suspendBasketButton);
    expect(mockSetState).toHaveBeenCalled();
  });

  it("Recall basket button should be display if basket empty ", async () => {
    const mockBasket: IbasketItem[] = [];

    const updateBasket = defaultBasketData();
    updateBasket.items = mockBasket;

    const { findByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[0][0].items[2]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
      {
        updateBasket,
      },
    );

    const recallBasketButton = await findByTestId("navigation_panel_item_Recall basket");
    expect(recallBasketButton.textContent).toContain("Recall basket");
    await user.click(recallBasketButton);
    expect(mockSetState).toHaveBeenCalled();
  });

  it("Licence item disable in basket in processing", async () => {
    const mockBasket: IbasketItem[] = [
      {
        id: "1234",
        total: 1234,
        price: 1234,
        commitStatus: CommitStatus.commitInitiated,
        quantity: 0,
        fulFillmentStatus: "fulfillmentInitiated",
        source: "nbit",
        additionalItemsValue: 0,
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = mockBasket;

    const { getByTestId } = renderWithRedux(
      <NavigationPanelItem
        title={stringConstants.NavigationPanel.navigationArray[2][0].items[1]}
        key={1}
        onItemPressed={mockItemPressed}
      />,
      {
        updateBasket,
      },
    );

    const licencesButton = getByTestId("navigation_panel_item_Licences");
    expect(licencesButton.textContent).toContain("Licences");
    await user.click(licencesButton);
    expect(mockSetState).toHaveBeenCalled();
  });
});
