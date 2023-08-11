import { useHomeScreen } from "@ct/common";
import { renderHookWithRedux } from "@ct/common/helpers";

describe("Testing useHomeScreen hook", () => {
  test("useHomeScreen hook", () => {
    renderHookWithRedux(() => useHomeScreen(), {});
  });
});
