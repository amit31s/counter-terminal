import { setTokens } from "../setTokens";

describe("render setTokens", () => {
  test("test set tokens", async () => {
    const result1 = await setTokens("/transactions/v3/");
    expect(result1).toBeUndefined();

    const result2 = await setTokens("transfer/v1/transaction");
    expect(result2).toBeUndefined();

    const result3 = await setTokens("/branch/");
    expect(result3).toBeUndefined();

    const result4 = await setTokens("/cash-drawer-association/v1/association");
    expect(result4).toBeUndefined();

    const result5 = await setTokens("/cash-drawer-association/v1/dissociation");
    expect(result5).toBeUndefined();

    const result6 = await setTokens("");
    expect(result6).toBeUndefined();
  });
});
