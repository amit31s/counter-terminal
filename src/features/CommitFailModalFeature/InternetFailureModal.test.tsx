import { renderWithRedux } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { InternetFailureModal } from "./InternetFailureModal";

describe("Api Fail Modal", () => {
  it("Api Error Modal Render Correctly", () => {
    const { getByTestId } = renderWithRedux(<InternetFailureModal />, {
      noNetwork: { isVisible: true, isVisibleNetworkRestored: false },
    });
    expect(getByTestId(stringConstants.CommitFailureModal.internetFailureTestId)).toBeTruthy();
  });
});
