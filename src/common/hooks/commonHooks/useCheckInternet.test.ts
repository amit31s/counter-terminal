import { renderHookWithRedux } from "@ct/common/helpers";
import { useCheckInternet } from "@ct/common/hooks";

describe("Testing useCheckInternet hook", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("checkInternet should return true when internet connection is available", () => {
    jest.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    const { result } = renderHookWithRedux(() => {
      const { checkInternet } = useCheckInternet();
      return checkInternet();
    }, {});
    expect(result.current).toEqual(true);
  });
  it("checkInternet should return false when internet connection is not available", () => {
    jest.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const { result } = renderHookWithRedux(() => {
      const { checkInternet } = useCheckInternet();
      return checkInternet();
    }, {});
    expect(result.current).toEqual(false);
  });
});
