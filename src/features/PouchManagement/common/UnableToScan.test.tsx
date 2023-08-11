import { renderWithRedux } from "@ct/common/helpers/test-utils";
import { UnableToScan } from "./UnableToScan";

describe("Render callBCS component", () => {
  it("Render callBCS ]successfully", async () => {
    const { queryByTestId } = renderWithRedux(<UnableToScan />, {});

    const elm = queryByTestId("callBCS");
    expect(elm).toBeTruthy();
  });
});
