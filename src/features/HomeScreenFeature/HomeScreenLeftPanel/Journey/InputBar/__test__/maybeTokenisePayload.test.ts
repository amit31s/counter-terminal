import { JourneyInterruptionTypes } from "../JourneyInterruptionTypes.enum";
import { maybeTokenisePayload } from "../maybeTokenisePayload";

describe("render maybeTokenisePayload", () => {
  it("test maybeTokenisePayload", () => {
    const result = maybeTokenisePayload("test-barcode", [
      JourneyInterruptionTypes.Barcode,
      JourneyInterruptionTypes.MagCard,
    ]);
    expect(result?.type).toEqual("tokeniser");
  });
});
