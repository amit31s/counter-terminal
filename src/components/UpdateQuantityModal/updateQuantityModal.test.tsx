import { renderWithRedux, renderWithReduxAndStore, setupUser } from "@ct/common";
import { CommitStatus, IUpdateBasketState } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { stringConstants } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces";
import { UpdateQuantityModal } from "./index";

function createTestItem(quantity: number, maxQuantity: number): IbasketItem {
  return {
    name: "Test Item 1",
    id: "test1",
    commitStatus: CommitStatus.notInitiated,
    additionalItemsValue: 0,
    fulFillmentStatus: "fulfillmentNotInitiated",
    price: 10,
    total: 10,
    source: "nbit",
    item: ["Test Item 1"],
    quantity,
    journeyData: {
      basket: {
        id: "2D Bde Read Test",
      },
      transaction: {
        maxQuantity: maxQuantity.toString(),
      },
    },
  };
}

function createTestBasket(quantity = 1, maxQuantity = 10, isEmpty = false): IUpdateBasketState {
  const basket = defaultBasketData();
  if (isEmpty) {
    return basket;
  }

  basket.items = [createTestItem(quantity, maxQuantity)];
  basket.customerToPay = quantity * 10;
  basket.selectedItem = basket.items[0];
  return basket;
}

describe("UpdateQuantityModal sales functionality", () => {
  it("quantity can be increased with the plus button", async () => {
    const user = setupUser();

    const {
      store,
      rendered: { getByLabelText, getByText, getByDisplayValue },
    } = renderWithReduxAndStore(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(),
    });

    await user.click(getByLabelText("increase quantity"));
    expect(getByDisplayValue("2")).toHaveAttribute("data-testid", "qty");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(2);

    await user.click(getByLabelText("increase quantity"));
    await user.click(getByLabelText("increase quantity"));
    expect(getByDisplayValue("4")).toHaveAttribute("data-testid", "qty");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(4);
  });

  it("quantity can be decreased with the minus button", async () => {
    const user = setupUser();

    const {
      store,
      rendered: { getByLabelText, getByText, getByDisplayValue },
    } = renderWithReduxAndStore(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(10, 10),
    });

    await user.click(getByLabelText("decrease quantity"));
    expect(getByDisplayValue("9")).toHaveAttribute("data-testid", "qty");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(9);

    await user.click(getByLabelText("decrease quantity"));
    await user.click(getByLabelText("decrease quantity"));
    expect(getByDisplayValue("7")).toHaveAttribute("data-testid", "qty");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(7);
  });

  it("quantity can be increased with the input", async () => {
    const user = setupUser();

    const {
      store,
      rendered: { getByText, getByDisplayValue },
    } = renderWithReduxAndStore(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(),
    });

    await user.type(getByDisplayValue("1"), "{backspace}5");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(5);
  });

  it("shows high quantity warning", async () => {
    const { getByText } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(100, 200),
    });

    expect(getByText(stringConstants.quantityEditor.errorHighQuantity)).toBeInTheDocument();
  });

  it("shows maximum limit warning", async () => {
    const { getByText } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(7, 6),
    });

    expect(getByText(stringConstants.quantityEditor.errorMaximumQuantity)).toBeInTheDocument();
  });

  it("quantity can be decreased with the input", async () => {
    const user = setupUser();

    const {
      store,
      rendered: { getByText, getByDisplayValue },
    } = renderWithReduxAndStore(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(10, 10),
    });

    await user.type(getByDisplayValue("10"), "{backspace}{backspace}5");
    await user.click(getByText("Confirm"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(5);
  });

  it("quantity change can be cancelled", async () => {
    const user = setupUser();

    const {
      store,
      rendered: { getByText, getByDisplayValue },
    } = renderWithReduxAndStore(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(),
      updateQuantityFlag: { flag: true },
    });

    await user.type(getByDisplayValue("1"), "{backspace}5");
    await user.click(getByText("Cancel"));
    expect(store.getState().updateBasket.items[0].quantity).toBe(1);
    expect(store.getState().updateQuantityFlag.flag).toBe(false);
  });

  it("disables decrease quantity at 0", () => {
    const { getByLabelText } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(0),
    });

    expect(getByLabelText("decrease quantity")).toHaveAttribute("aria-disabled", "true");
  });

  it("disables increase quantity at max quantity", () => {
    const { getByLabelText } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(11, 10),
    });

    expect(getByLabelText("increase quantity")).toHaveAttribute("aria-disabled", "true");
  });

  it("sets quantity to 0 when no item is selected", () => {
    const { getByDisplayValue } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(1, 10, true),
    });

    expect(getByDisplayValue("0")).toBeInTheDocument();
  });

  it("Show error with quantity max length equal", () => {
    const { getByTestId } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(1000, 1000),
    });
    const textView = getByTestId("qtyError");
    expect(textView.textContent).toBe(stringConstants.quantityEditor.errorHighQuantity);
  });

  it("Show error with quantity more than max quantity", () => {
    const { getByTestId } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(1001, 1000),
    });
    const textView = getByTestId("qtyError");
    expect(textView.textContent).toBe(stringConstants.quantityEditor.errorMaximumQuantity);
  });
  it("Show error with quantity less than max", () => {
    const { getByTestId } = renderWithRedux(<UpdateQuantityModal />, {
      updateBasket: createTestBasket(999, 1000),
    });
    const textView = getByTestId("qtyError");
    expect(textView.textContent).toBe(stringConstants.quantityEditor.errorHighQuantity);
  });
});
