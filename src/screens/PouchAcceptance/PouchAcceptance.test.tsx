import { renderWithRedux } from "@ct/common";
import { PouchAcceptanceScreen } from "./PouchAcceptance";

describe("PouchAcceptanceScreen", () => {
  it("should render pouch acceptance screen", () => {
    const { getByText } = renderWithRedux(<PouchAcceptanceScreen />);
    expect(getByText("Pouch acceptance")).toBeTruthy();
  });
});
