import { renderWithRedux, setupUser } from "@ct/common";
import { BUTTON, stringConstants } from "@ct/constants";
import { ApiFailModal } from "./ApiFailModal";

const handleOnFinishCallback = jest.fn();

describe("Api Fail Modal", () => {
  it("Api Error Modal Render Correctly", () => {
    const { getByTestId } = renderWithRedux(
      <ApiFailModal onFinishCallback={handleOnFinishCallback} />,
      {
        updateCommitApiStatusFlag: {
          isErrorOccured: true,
          showModal: true,
        },
      },
    );
    expect(getByTestId(stringConstants.CommitFailureModal.apiFailureTestId)).toBeTruthy();
  });
  it("Close Modal on click of cancel button", async () => {
    const user = setupUser();
    const { getByTestId, queryByTestId } = renderWithRedux(
      <ApiFailModal onFinishCallback={handleOnFinishCallback} />,
      {
        updateCommitApiStatusFlag: {
          isErrorOccured: true,
          showModal: true,
        },
      },
    );
    expect(getByTestId(stringConstants.CommitFailureModal.apiFailureTestId)).toBeTruthy();
    expect(getByTestId(BUTTON.CTBTN0006)).toBeTruthy();
    await user.click(getByTestId(BUTTON.CTBTN0006));
    expect(queryByTestId(BUTTON.CTBTN0006)).toBeFalsy();
  });
});
