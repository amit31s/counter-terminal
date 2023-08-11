import { renderWithRedux } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { EntryType, IbasketItem } from "@ct/interfaces/basket.interface";
import { BasketItemsList } from ".";

describe("Testing BasketItemsList component", () => {
  it("Should render basket with 2 items", async () => {
    const items: IbasketItem[] = [
      {
        id: "1",
        name: "Item 1",
        price: 1,
        quantity: 1,
        total: 1,
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        source: "nbit",
      },
      {
        id: "2",
        name: "Item 2",
        price: 2,
        quantity: 1,
        total: 2,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
      },
    ];

    const { findAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[0]} />,
    );

    const children = await findAllByTestId("renderItemTest");

    expect(children.length).toBe(2);
  });

  it("doesn't render basket items if the total is 0", async () => {
    const items: IbasketItem[] = [
      {
        id: "1",
        name: "Item 1",
        price: 0,
        quantity: 0,
        total: 0,
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "fulfillmentNotInitiated",
        source: "nbit",
      },
    ];
    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 3;
    updateBasket.basketValue = 3;
    const { queryAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[0]} />,
      {
        updateBasket,
      },
    );

    const children = queryAllByTestId("renderItemTest");

    expect(children.length).toBe(0);
  });

  it("select item above item from basket", async () => {
    const items: IbasketItem[] = [
      {
        id: "1",
        name: "Item 1",
        price: 1,
        quantity: 1,
        total: 1,
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        source: "nbit",
      },
      {
        id: "2",
        name: "Item 2",
        price: 2,
        quantity: 1,
        total: 2,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 3;
    updateBasket.basketValue = 3;
    const { queryAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[0]} />,
      {
        updateBasket,
      },
    );
    const item = queryAllByTestId("testSelectedItem");
    expect(item[0]).toHaveStyle({ backgroundColor: "#FFEECC" });
    expect(item[1]).toHaveStyle({ backgroundColor: "#FFFFFF" });
  });

  it("select item below item from basket", async () => {
    const items: IbasketItem[] = [
      {
        id: "1",
        name: "Item 1",
        price: 1,
        quantity: 1,
        total: 1,
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
        source: "nbit",
      },
      {
        id: "2",
        name: "Item 2",
        price: 2,
        quantity: 1,
        total: 2,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 3;
    updateBasket.basketValue = 3;

    const { queryAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[1]} />,
      {
        updateBasket,
      },
    );
    const item = queryAllByTestId("testSelectedItem");
    expect(item[0]).toHaveStyle({ backgroundColor: "#FFFFFF" });
    expect(item[1]).toHaveStyle({ backgroundColor: "#FFEECC" });
  });

  it("renders quantities and prices with correct text align", async () => {
    const items: IbasketItem[] = [
      {
        id: "2",
        name: "Item 2",
        price: -2,
        quantity: -1,
        total: -2,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 3;
    updateBasket.basketValue = 3;

    const { queryAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[1]} />,
      {
        updateBasket,
      },
    );
    const itemQuantity = queryAllByTestId("basketItemQuantity");
    expect(itemQuantity[0].parentElement).toHaveStyle({ textAlign: "center" });
    const itemPrice = queryAllByTestId("basketItemPrice");
    expect(itemPrice[0].parentElement).toHaveStyle({ textAlign: "center" });
  });

  it("renders total correctly based on negative quantity and price", async () => {
    const items: IbasketItem[] = [
      {
        id: "2",
        name: "Item 2",
        price: -2,
        quantity: -2,
        total: -4,
        source: "nbit",
        type: EntryType.paymentMode,
        commitStatus: CommitStatus.success,
        additionalItemsValue: 0,
        fulFillmentStatus: "success",
      },
    ];

    const updateBasket = defaultBasketData();
    updateBasket.items = items;
    updateBasket.customerToPay = 3;
    updateBasket.basketValue = 3;

    const { queryAllByTestId } = renderWithRedux(
      <BasketItemsList dataList={items} selectedItem={items[1]} />,
      {
        updateBasket,
      },
    );
    const itemQuantity = queryAllByTestId("basketItemQuantity");
    expect(itemQuantity[0]).toHaveTextContent("-2");
    const itemTotal = queryAllByTestId("basketItemTotal");
    expect(itemTotal[0]).toHaveTextContent("-£4.00");
    const itemPrice = queryAllByTestId("basketItemPrice");
    expect(itemPrice[0]).toHaveTextContent("-£2.00");
  });

  it("Should render empty basket with 0 items with numpad enabled", async () => {
    const items: IbasketItem[] = [];
    const { getByTestId } = renderWithRedux(<BasketItemsList dataList={items} />, {
      updateNumpadFlagStatus: {
        flag: true,
      },
    });

    expect(getByTestId("test-empty-basket")).toBeTruthy();
  });

  it("Should render empty basket with 0 items with numpad disabled", async () => {
    const items: IbasketItem[] = [];
    const { getByTestId } = renderWithRedux(<BasketItemsList dataList={items} />, {
      updateNumpadFlagStatus: {
        flag: false,
      },
    });

    expect(getByTestId("test-empty-basket")).toBeTruthy();
  });
});
