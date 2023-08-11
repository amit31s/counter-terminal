import { renderWithRedux, setupUser } from "@ct/common";
import { stringConstants } from "@ct/constants";
import * as PouchDispatchService from "@ct/utils/Services/pouchDispatchService";
import { PreparePouchToDispatch } from "./PreparePouchToDispatch";

describe("Render PreparePouchToDispatch", () => {
  const mockOpenBackOfficeForPreparePouchList = jest.spyOn(
    PouchDispatchService,
    "openBackOfficeForPreparePouchList",
  );
  it("Render Prepare pouch to dispatch button is visible and openBackOfficeForPreparePouchList is called on preparePouchPress", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithRedux(<PreparePouchToDispatch />, {});
    const preparePouchButton = getByTestId(stringConstants.Button.PreparePouches);
    expect(preparePouchButton).toBeTruthy();
    await user.click(preparePouchButton);
    expect(mockOpenBackOfficeForPreparePouchList).toHaveBeenCalledTimes(1);
  });
});
