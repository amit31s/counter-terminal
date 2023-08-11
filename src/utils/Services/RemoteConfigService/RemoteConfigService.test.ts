import storage from "postoffice-spm-async-storage";
import { remoteConfigService } from ".";

jest.mock("postoffice-product-journey-api-clients", () => ({
  ...jest.requireActual("postoffice-product-journey-api-clients"),
  buildConfigurationClient: () => ({
    hash: jest.fn().mockResolvedValue("abcd"),
    data: jest
      .fn()
      .mockResolvedValue({ hash: "mock-hash", data: [{ id: "mock-id", value: "mock-value" }] }),
    getConfig: jest.fn(),
  }),
}));

describe("remoteConfigService", () => {
  const root = "http://example.com";
  const authHeaders = jest.fn().mockResolvedValue({ token: "mock-token" });
  describe("remoteConfigService-isSynced", () => {
    it("should return true when the remote hash matches the local hash", async () => {
      jest.spyOn(storage, "getRecord").mockResolvedValue({ value: "abcd", id: "mock-id" });
      const service = remoteConfigService(root, authHeaders);
      const result = await service.isSynced();
      expect(result).toBe(true);
    });

    it("returns false when remote and local hash do not match", async () => {
      jest.spyOn(storage, "getRecord").mockResolvedValue({ value: "1234", id: "mock-id" });
      const service = remoteConfigService(root, authHeaders);
      const result = await service.isSynced();
      expect(result).toBe(false);
    });
  });
  describe("remoteConfigService-clear", () => {
    it("removes all records with the config prefix", async () => {
      const removeRecord = jest.fn();
      const value = ["c1", "c2"];
      jest.spyOn(storage, "getKeysByPrefix").mockResolvedValue(value);
      jest.spyOn(storage, "removeRecord").mockImplementation(removeRecord);

      const service = remoteConfigService(root, authHeaders);
      await service.clear();

      expect(removeRecord).toHaveBeenCalledTimes(value.length);
      for (let index = 0; index < value.length; index++) {
        expect(removeRecord).toHaveBeenCalledWith(value[index]);
      }
    });
  });
  describe("remoteConfigService-sync", () => {
    it("should sync", async () => {
      const setRecord = jest.fn();
      const setRecords = jest.fn();
      jest.spyOn(storage, "setRecord").mockImplementation(setRecord);
      jest.spyOn(storage, "setRecords").mockImplementation(setRecords);

      const service = remoteConfigService(root, authHeaders);
      await service.sync();

      expect(setRecord).toHaveBeenCalledTimes(1);
      expect(setRecords).toHaveBeenCalledTimes(1);
    });
  });
});
