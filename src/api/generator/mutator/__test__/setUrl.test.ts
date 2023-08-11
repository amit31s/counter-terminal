import { renderHook } from "@ct/common";
import { setUrl } from "../setUrl";
const urls = [
  "/transaction",
  "/association",
  "/dissociation",
  "/association/list",
  "/pouch/poc/list",
  "/pouch/rdc/validate",
  "/pouch/rdc/list",
  "/pouch/poc/validate",
  "/basket/",
  "/lastBasket",
  "/branch/",
];

describe("render setUrl", () => {
  test("test setUrl", () => {
    renderHook(async () => {
      const endpoint1 = await setUrl(urls[0]);
      expect(endpoint1).toEqual("transfer/v1/transaction");

      const endpoint2 = await setUrl(urls[1]);
      expect(endpoint2).toEqual("/association");

      const endpoint3 = await setUrl(urls[2]);
      expect(endpoint3).toEqual("/dissociation");

      const endpoint4 = await setUrl(urls[3]);
      expect(endpoint4).toEqual("/association/list");

      const endpoint5 = await setUrl(urls[4]);
      expect(endpoint5).toEqual("/pouch/poc/list");

      const endpoint6 = await setUrl(urls[5]);
      expect(endpoint6).toEqual("/pouch/rdc/validate");

      const endpoint7 = await setUrl(urls[6]);
      expect(endpoint7).toEqual("/pouch/rdc/list");

      const endpoint8 = await setUrl(urls[7]);
      expect(endpoint8).toEqual("/pouch/poc/validate");

      const endpoint9 = await setUrl(urls[8]);
      expect(endpoint9).toEqual("transactions/v2/basket/");

      const endpoint10 = await setUrl(urls[9]);
      expect(endpoint10).toEqual("/transactions/v3/lastBasket");

      const endpoint11 = await setUrl(urls[10]);
      expect(endpoint11).toEqual("/transactionviewer/v1/branch/");

      const endpoint12 = await setUrl("test-url");
      expect(endpoint12).toEqual("test-url");
    });
  });
});
