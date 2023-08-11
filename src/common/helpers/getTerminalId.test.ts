import { renderHookWithRedux } from "@ct/common/helpers";
import { getTerminalId } from "./getTerminalId";

describe("Testing getTerminalID function", () => {
  test("testing terminal ID in getTerminalID", async () => {
    const { result } = renderHookWithRedux(() => {
      const terminalId = getTerminalId("6243401", "33");
      return terminalId;
    });

    const payload = await result.current;
    expect(payload).toEqual("62434033");
  });
});
