import { renderWithRedux } from "@ct/common";
import { PouchDispatch } from "./PouchDispatch";

describe("PouchDispatchLeftPanel", () => {
  it("should render pouch despatch screen", () => {
    const { getByText } = renderWithRedux(<PouchDispatch />);
    expect(getByText("Pouch dispatch")).toBeTruthy();
  });
});
