import * as paymentpayload from "@ct/common/helpers/paymentCommitPayload";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { basketItemMock, chequePayloadMock } from "@ct/utils/MockData";
import { FallBackModeFlagEnum, RefundFlagEnum } from "postoffice-commit-and-fulfill";
import { prepareChequePayloadToCommit } from "./QuickTendering.helper";

describe("testing prepareChequePayloadToCommit", () => {
  it("should return undefined when no cheque payment is found", async () => {
    const entryID = 123;
    const defaultBasket = defaultBasketData();
    const items = basketItemMock();
    defaultBasket.items.push(...items);
    const result = await prepareChequePayloadToCommit({
      basketItems: defaultBasket.items,
      entryID,
    });

    expect(result).toBeUndefined();
  });

  it("should prepare cheque payload and return the payload and updated entry ID", async () => {
    const defaultBasket = defaultBasketData();
    const items = basketItemMock();
    defaultBasket.items.push(...items, chequePayloadMock);
    const entryID = 123;
    jest.spyOn(paymentpayload, "chequePaymentPayload").mockResolvedValue({
      quantity: -1,
      entryID: entryID,
      valueInPence: -8000,
      transactionStartTime: 1688363120536,
      itemID: "2",
      additionalItems: [],
      stockunitIdentifier: "C68",
      methodOfDataCapture: 1,
      refundFlag: RefundFlagEnum.N,
      fallBackModeFlag: FallBackModeFlagEnum.N,
      tokens: {
        entryID: "1",
        productDescription: "Cheque",
        itemType: "2",
        existingReversalAllowed: "Y",
        requestUDID: "0325cdd9-57fd-4530-afd4-0eb58c49434b",
      },
    });

    const result = await prepareChequePayloadToCommit({
      basketItems: defaultBasket.items,
      entryID,
    });

    expect(result?.payloadToCommit.length).toBe(1);
    expect(result?.payloadToCommit[0].itemID).toBe("2");
    expect(result?.payloadToCommit[0].entryID).toBe(entryID);
    expect(result?.entryID).toBe(entryID + 1);
  });
});
