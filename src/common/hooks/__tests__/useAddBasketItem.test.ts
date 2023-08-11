import { renderHookWithReduxAndStore } from "@ct/common/helpers";
import { JOURNEYENUM } from "@ct/features/HomeScreenFeature/homeScreen.enum";
import { useAddBasketItem } from "../useAddBasketItem";

const mockData = {
  basket: {
    id: "mock-basket-id",
  },
  transaction: {
    entryID: "2",
    itemID: "6401",
    tokens: {
      productDescription: "PS Virgin etu £2",
      fulfilmentAction: "",
    },
  },
};

// jest.spyOn(homeService, "prepareBasketItemData").mockResolvedValue({ basketArray: items });

describe("Testing useAddBasketItem hook", () => {
  it("test useAddBasketItem", async () => {
    const { store } = renderHookWithReduxAndStore(async () => {
      const addBasketItem = useAddBasketItem();
      await addBasketItem(mockData);
    });
    const { cashTenderReceivedAmountTxCommited, cashTenderTenderedAmountTxCommited } =
      store.getState().updatePaymentStatus;
    expect(cashTenderReceivedAmountTxCommited).toBe(true);
    expect(cashTenderTenderedAmountTxCommited).toBe(true);
  });

  it("test useAddBasketItem with withdrawal", async () => {
    const { store } = renderHookWithReduxAndStore(() => {
      const addBasketItem = useAddBasketItem();
      const data = { ...mockData };
      data.transaction.tokens.fulfilmentAction = JOURNEYENUM.CASH_WITHDRAWAL;
      addBasketItem(data);
    });
    const { cashTenderReceivedAmountTxCommited, cashTenderTenderedAmountTxCommited } =
      store.getState().updatePaymentStatus;
    expect(cashTenderReceivedAmountTxCommited).toBe(false);
    expect(cashTenderTenderedAmountTxCommited).toBe(true);
  });

  it("test useAddBasketItem with deposit", async () => {
    const { store } = renderHookWithReduxAndStore(() => {
      const addBasketItem = useAddBasketItem();
      const data = { ...mockData };
      data.transaction.tokens.fulfilmentAction = JOURNEYENUM.CASH_DEPOSIT;
      addBasketItem(data);
    });
    const { cashTenderReceivedAmountTxCommited, cashTenderTenderedAmountTxCommited } =
      store.getState().updatePaymentStatus;
    expect(cashTenderReceivedAmountTxCommited).toBe(true);
    expect(cashTenderTenderedAmountTxCommited).toBe(false);
  });
});
