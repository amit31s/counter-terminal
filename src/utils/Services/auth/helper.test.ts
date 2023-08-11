import { RawDeviceAttributes, RawUserIdentities } from "@ct/interfaces";
import { parseCognitoAttributes, parseUserIdentities } from "./helper";

describe("Testing src/utils/Services/auth/helper.ts", () => {
  it("Testing parseUserIdentities with valid identities", () => {
    const identities = [{ userId: "userId", providerName: "providerName", dateCreated: 0 }];
    const { id, provider, createdAt } = parseUserIdentities(identities);
    expect(id).toEqual(identities[0].userId);
    expect(provider).toEqual(identities[0].providerName);
    expect(createdAt).toEqual(identities[0].dateCreated);
  });

  it("Testing parseUserIdentities with empty array as identities", () => {
    const identities = [] as unknown as RawUserIdentities[];
    const { id, provider, createdAt } = parseUserIdentities(identities);
    expect(id).toEqual("");
    expect(provider).toEqual("");
    expect(createdAt).toEqual(0);
  });

  it("Testing parseUserIdentities with undefined as identities", () => {
    const identities = undefined as unknown as RawUserIdentities[];
    const { id, provider, createdAt } = parseUserIdentities(identities);
    expect(id).toEqual("");
    expect(provider).toEqual("");
    expect(createdAt).toEqual(0);
  });

  it("Testing parseUserIdentities with object as identities", () => {
    const identities = {} as unknown as RawUserIdentities[];
    const { id, provider, createdAt } = parseUserIdentities(identities);
    expect(id).toEqual("");
    expect(provider).toEqual("");
    expect(createdAt).toEqual(0);
  });

  it("Testing parseCognitoAttributes with object as RawDeviceAttributes", () => {
    const rawDeviceAttribute: RawDeviceAttributes = {
      "custom:node_id": "test-node-id",
      "custom:id": "test-id",
      "custom:type": "test-type",
      "custom:branch_id": "test-branch_id",
      "custom:branch_name": "test-branch_name",
      "custom:branch_address": "test-branch_address",
      "custom:branch_postcode": "test-branch_postcode",
      "custom:branch_unit_code": "test-branch_unit_code",
      "custom:branch_unit_code_ver": "test-branch_unit_code_ver",
    };
    const { nodeID, deviceID, deviceType } = parseCognitoAttributes(rawDeviceAttribute);
    expect(nodeID).toEqual("test-node-id");
    expect(deviceID).toEqual("test-id");
    expect(deviceType).toEqual("test-type");
  });
});
