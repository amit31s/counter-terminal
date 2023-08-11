import { renderWithRedux } from "@ct/common";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { BUTTON } from "@ct/constants";
import { EntryType } from "@ct/interfaces";
import { Quantity } from "./QuantityButton";

describe("Testing Quantity button", () => {
  it("Should disable quantity button for payment entries", () => {
    const updateBasket = defaultBasketData();
    updateBasket.selectedItem = {
      id: "Visa Debit297dc159-7cb4-41f5-b40e-201e56c776ee",
      name: "Visa Debit",
      commitStatus: CommitStatus.notInitiated,
      fulFillmentStatus: "fulfillmentInitiated",
      total: -2,
      quantity: 1,
      price: -2,
      source: "nbit",
      additionalItemsValue: 0,
      journeyData: {
        transaction: {
          entryID: "1",
          itemID: "34197",
          tokens: {
            productDescription: "Visa Debit",
            fulfilmentAction: "debit",
            fulfilmentType: "PED",
          },
        },
      },
      type: EntryType.paymentMode,
    };
    const { getByTestId } = renderWithRedux(<Quantity />, {
      updateBasket,
    });
    const completeBtn = getByTestId(BUTTON.CTBTN0014);
    expect(completeBtn).toHaveAttribute("aria-disabled", "true");
  });
});
