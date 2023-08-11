import { renderWithRedux } from "@ct/common/helpers";
import { stringConstants } from "@ct/constants";
import { NavigationPanelHeader } from "./NavigationPanelHeader";

describe("Navigation Panel header", () => {
  const mockItemPressed = jest.fn();
  it("should render navigation panel header", async () => {
    const { getByTestId } = renderWithRedux(
      <NavigationPanelHeader
        title={stringConstants.NavigationPanel.BasketMenuHeader}
        items={stringConstants.NavigationPanel.navigationArray[0][0].items}
        onItemPressed={mockItemPressed}
      />,
    );
    const basketHeader = getByTestId("Basketheader");
    expect(basketHeader).toBeTruthy();
  });

  it("should render navigation panel without title", async () => {
    const { getByTestId } = renderWithRedux(
      <NavigationPanelHeader
        title={""}
        items={stringConstants.NavigationPanel.navigationArray[0][0].items}
        onItemPressed={mockItemPressed}
      />,
    );
    const basketText = getByTestId("Text");
    expect(basketText.textContent).toBe("");
  });

  it("should render navigation panel title", async () => {
    const { getByTestId } = renderWithRedux(
      <NavigationPanelHeader
        title={stringConstants.NavigationPanel.BasketMenuHeader}
        items={stringConstants.NavigationPanel.navigationArray[0][0].items}
        onItemPressed={mockItemPressed}
      />,
    );
    const basketText = getByTestId("BasketText");
    expect(basketText.textContent).toBe("Basket");
  });
});
