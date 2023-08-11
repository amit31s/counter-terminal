import { renderWithRedux } from "@ct/common";
import { stringConstants } from "@ct/constants";
import { ShowLicences } from "./ShowLicences";

describe("Show Licences", () => {
  it("Show Licences Render Correctly", () => {
    const { getByTestId } = renderWithRedux(<ShowLicences />);
    expect(getByTestId(stringConstants.ShowLicencesModal.showLicencesBodyTestID)).toBeTruthy();
  });
});
