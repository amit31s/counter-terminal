import { Currency, MaterialType, PouchAcceptanceDetailsItems } from "@ct/api/generator";
import { ERROR } from "@ct/common/enums";
import { stringConstants } from "@ct/constants";
import { penceToPound } from "./Services";
import * as utils from "./utils";

describe("Testing utils", () => {
  it("Testing removeLineBreaks in utils", () => {
    expect(utils.removeLineBreaks(`abc\n  xxxx\nxxxxx\n    \n`)).toBe("abc  xxxxxxxxx    ");
  });
  it("Testing priceToRender method", () => {
    expect(utils.priceToRender(20)).toBe(`${stringConstants.Symbols.Pound}${penceToPound(20)}`);
  });
  it("Testing openUrl isNetworkError method", () => {
    utils.openUrl("www.test.com");
    const error1 = ERROR.NETWORK_ERROR;
    const error2 = new Error("Network Error");
    const error3 = new Error("Network Error occurred");
    const error4 = new Error("something went wrong");
    const error5 = "Uncaught ReferenceError: a is not defined";

    expect(utils.isNetworkError(error1)).toBe(true);
    expect(utils.isNetworkError(error2)).toBe(true);
    expect(utils.isNetworkError(error3)).toBe(true);
    expect(utils.isNetworkError(error4)).toBe(false);
    expect(utils.isNetworkError(error5)).toBe(false);
  });

  it("Testing priceToRender method with negative value", () => {
    utils.openUrl("www.test.com");
    expect(utils.priceToRender(-20.0)).toBe(`-${stringConstants.Symbols.Pound}${penceToPound(20)}`);
  });

  it("Testing getAdditionalItems method with valid value", () => {
    const pouchItems: PouchAcceptanceDetailsItems = {
      "123": {
        itemValue: 1,
        itemID: "123",
        itemQuantity: 1,
        denomination: 1,
        currency: Currency.GBP,
        materialType: MaterialType.COIN,
      },
    };
    const result = utils.getAdditionalItems(pouchItems);
    const output = result ?? [];
    expect(output[0].itemID).toBe("123");
  });

  it("Testing getAdditionalItems method with invalid value", () => {
    const pouchItems: PouchAcceptanceDetailsItems =
      undefined as unknown as PouchAcceptanceDetailsItems;
    const result = utils.getAdditionalItems(pouchItems);
    expect(result).toBe(undefined);
  });

  it("Testing circular json stringify value", () => {
    const object = { array: { first: 1 }, array2: { array: { first: 1 } } };
    object.array = { first: 1 };
    object.array2 = object;
    const result = utils.stringify(object);
    expect(result).toBe('{"array":{"first":1}}');
  });
});
