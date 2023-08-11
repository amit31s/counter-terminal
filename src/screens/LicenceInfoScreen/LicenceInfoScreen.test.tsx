import { renderWithRedux } from "@ct/common";
import { LicenceInfoScreen } from "./LicenceInfoScreen";

describe("Render LicenceInfoScreen", () => {
  it("should render licence info screen", () => {
    const { getByText } = renderWithRedux(<LicenceInfoScreen />);
    expect(getByText("Licences")).toBeTruthy();
  });
});
