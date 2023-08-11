import { renderWithRedux } from "@ct/common";
import { TEXT } from "@ct/constants";
import { CloseBasketFailureModal } from "./CloseBasketFailureModal";

describe("Close Basket Failure Modal ", () => {
  it("should render failure modal for fulfilment pending", async () => {
    const { getByTestId } = renderWithRedux(<CloseBasketFailureModal />, {
      updateBasketIdStatus: {
        closeBasketFailed: true,
        errorCode: "TE0102436",
      },
    });
    expect(getByTestId(TEXT.CTTXT0004)).toBeTruthy();
  });
  it("should render failure modal for failed to close basket", async () => {
    const { getByTestId } = renderWithRedux(<CloseBasketFailureModal />, {
      updateBasketIdStatus: {
        closeBasketFailed: true,
        errorCode: "TE0102437",
      },
    });
    expect(getByTestId(TEXT.CTTXT0002)).toBeTruthy();
  });
});
