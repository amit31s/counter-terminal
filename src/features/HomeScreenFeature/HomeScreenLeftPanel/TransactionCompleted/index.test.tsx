import { renderWithRedux } from "@ct/common/helpers/test-utils";
import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { defaultBasketData } from "@ct/common/state/initialStateData";
import { STRING_CONSTANTS } from "@ct/constants";
import { TransactionCompleted } from ".";

describe("TransactionCompleted", () => {
  it("shows expected text", async () => {
    const updateBasket = defaultBasketData();
    updateBasket.items = [
      {
        id: "1",
        total: 0,
        quantity: 1,
        price: 0,
        commitStatus: CommitStatus.success,
        fulFillmentStatus: "notRequired",
        source: "local",
        additionalItemsValue: 0,
      },
    ];
    const { getByText } = renderWithRedux(<TransactionCompleted />, {
      updatePaymentStatus: {
        time: 0,
        completed: true,
        paidByCash: 0,
        paidByCard: 0,
        deductAmount: false,
        cashTenderReceivedAmount: 0,
        cashTenderReceivedAmountTxCommited: false,
        cashTenderTenderedAmount: 0,
        cashTenderTenderedAmountTxCommited: false,
        isRepayMode: false,
        txStatus: "",
      },
      updateBasket,
    });

    expect(getByText(STRING_CONSTANTS.transactionComplete)).toBeTruthy();
  });
});
