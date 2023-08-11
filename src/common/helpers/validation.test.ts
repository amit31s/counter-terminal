import { isMessagePrompt, isRecord, multipleOf } from "@ct/common/helpers/validation";

describe("Validators", () => {
  test("multipleOf returns correct results", () => {
    expect(multipleOf(4, 2)).toBe(true);
    expect(multipleOf(8, 2)).toBe(true);
    expect(multipleOf(9, 3)).toBe(true);
    expect(multipleOf(9.5, 3)).toBe(false);
  });

  test("isRecord returns correct results", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: "b" })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord(0)).toBe(false);
    expect(isRecord(1)).toBe(false);
    expect(isRecord(false)).toBe(false);
    expect(isRecord(true)).toBe(false);
    expect(isRecord("")).toBe(false);
    expect(isRecord("string")).toBe(false);
  });

  test("isMessagePrompt returns correct results", () => {
    expect(isMessagePrompt({ id: "", description: "" })).toBe(true);
    expect(isMessagePrompt({ id: null, description: "" })).toBe(false);
    expect(isMessagePrompt({ id: "", description: null })).toBe(false);
    expect(isMessagePrompt({ id: "" })).toBe(false);
    expect(isMessagePrompt({ description: "" })).toBe(false);
    expect(isMessagePrompt(null)).toBe(false);
  });
});
