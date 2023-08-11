import { renderHookWithRedux } from "@ct/common";
import { basketItemMock } from "@ct/utils/MockData";
import { useResetTenderingActionsAfterNetworkError } from "./useResetTenderingActionsAfterNetworkError";

describe("Testing useResetTenderingActionsAfterNetworkError hook", () => {
  test("reset tendering states if network interruption happens", () => {
    const basketItems = basketItemMock();
    const setWillPerformAfterPaymentCommit = jest.fn();
    const setIsProcessing = jest.fn();

    renderHookWithRedux(
      () =>
        useResetTenderingActionsAfterNetworkError({
          setWillPerformAfterPaymentCommit,
          setIsProcessing,
        }),
      {
        noNetwork: {
          isVisible: true,
          isVisibleNetworkRestored: false,
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
      },
    );
    expect(setWillPerformAfterPaymentCommit).toHaveBeenCalledTimes(1);
    expect(setIsProcessing).toHaveBeenCalledTimes(1);
  });
});
