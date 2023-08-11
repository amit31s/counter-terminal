import { render } from "@ct/common";
import { NoPouchScanned } from "../noPouchScanned";

describe("No pouch scanner", () => {
  it("snapshot no pouch scanner", async () => {
    const view = render(<NoPouchScanned />);
    expect(view.baseElement).toMatchSnapshot();
  });
});
