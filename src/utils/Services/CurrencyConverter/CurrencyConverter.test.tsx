import {
  intToFloat,
  penceToPound,
  poundToPence,
  appendPoundSymbolWithAmount,
  floatConversion,
} from "./index";

describe("Testing Currency Convertor Service", () => {
  test("Testing Pound To Pence Function", () => {
    expect(penceToPound(100)).toBe(1);
  });
  test("Testing Pence To Pound Function", () => {
    expect(poundToPence(1)).toBe(100);
  });
  test("Testing appendPoundSymbolWithAmount Function", () => {
    expect(appendPoundSymbolWithAmount(100)).toBe("£100.00");
  });
  test("Testing appendPoundSymbolWithAmount Function with negative value", () => {
    expect(appendPoundSymbolWithAmount(-100)).toBe("-£100.00");
  });
  test("Testing floatConversion Function with number value", () => {
    expect(floatConversion(100)).toBe("100");
  });
  test("Testing floatConversion Function with float value", () => {
    expect(floatConversion(100.01)).toBe("100.01");
  });
  test("Testing floatConversion Function with string value", () => {
    expect(floatConversion("100")).toBe("100");
  });
  test("Testing intToFloat", () => {
    const output1 = intToFloat(1);
    const output2 = intToFloat(1.0);
    const output3 = intToFloat(0);
    const output4 = intToFloat(111.0);

    expect(output1 + "").toEqual("1.00");
    expect(output2 + "").toEqual("1.00");
    expect(output3 + "").toEqual("0");
    expect(output4 + "").toEqual("111.00");
  });
});
