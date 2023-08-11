import { getItem, removeItem, setItem } from "../Storage";

describe("test suite for Storage", () => {
  const testAsyncKey = "test-key";
  const testAsyncStringValue = "test-value";
  const testAsyncObjectValue = { testKey: "test-value" };

  test("test setItem getItem with String value", async () => {
    const result = await setItem(testAsyncKey, testAsyncStringValue);
    expect(result).toBeUndefined();
    const item = await getItem(testAsyncKey);
    expect(item).toBe("test-value");
  });

  test("test setItem getItem with Object value", async () => {
    const result = await setItem(testAsyncKey, testAsyncObjectValue);
    expect(result).toBeUndefined();
    const item = await getItem(testAsyncKey);
    const convertedItem = JSON.parse(item);
    expect(convertedItem.testKey).toBe("test-value");
  });

  test("test empty getItem with invalid key", async () => {
    const result = await setItem(testAsyncKey, testAsyncStringValue);
    expect(result).toBeUndefined();
    const item = await getItem("invalid-key");
    expect(item).toBe("");
  });

  test("test removeItem with invalid key", async () => {
    const result = await setItem(testAsyncKey, testAsyncStringValue);
    expect(result).toBeUndefined();
    await removeItem(testAsyncKey);
    const item = await getItem(testAsyncKey);
    expect(item).toBe("");
  });
});
