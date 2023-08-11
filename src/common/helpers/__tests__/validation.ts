import { multipleOf } from "../validation";

describe("validation", () => {
  it("should return true when a multiple of", () => {
    const isMultipleOf = multipleOf(100, 2);
    expect(isMultipleOf).toEqual(true);
  });
  it("should return false when not a multiple of", () => {
    const isMultipleOf = multipleOf(109, 2);
    expect(isMultipleOf).toEqual(false);
  });
});
