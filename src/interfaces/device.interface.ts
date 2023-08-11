export interface RawDeviceAttributes {
  "custom:node_id": string;
  "custom:id": string;
  "custom:type": string;
  "custom:branch_id": string;
  "custom:branch_name": string;
  "custom:branch_address": string;
  "custom:branch_postcode": string;
  "custom:branch_unit_code": string;
  "custom:branch_unit_code_ver": string;
}

export interface DeviceAttributes {
  nodeID: string;
  deviceID: string;
  deviceType: string;
  branchID: string;
  branchName: string;
  branchAddress: string;
  branchPostcode: string;
  branchUnitCode: string;
  branchUnitCodeVer: string;
}

export interface IAuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}
