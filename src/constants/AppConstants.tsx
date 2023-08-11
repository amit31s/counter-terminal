import { envProvider } from "@ct/common/platformHelper";
export const APP_CONSTANTS = {
  CONST0001: "", // free to use
  CONST0002: 24,
  CONST0003: "S01",
  CONST0004: "308116319789",
  // key to get Forge Rock username
  CONST0005: `CognitoIdentityServiceProvider.${envProvider.REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID}.LastAuthUser`,
  // key to get Forge Rock id token
  CONST0006: (username: string) =>
    `CognitoIdentityServiceProvider.${envProvider.REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID}.${username}.idToken`,
  CONST0007: "", // free to use
  CONST0008: 28,
  // key to get Device username
  CONST0009: `CognitoIdentityServiceProvider.${envProvider.REACT_APP_AWS_COGNITO_WEB_CLIENT_ID}.LastAuthUser`,
  // key to set or get Device id token
  CONST0010: (username: string) =>
    `CognitoIdentityServiceProvider.${envProvider.REACT_APP_AWS_COGNITO_WEB_CLIENT_ID}.${username}.idToken`,
  test: "40046",
  backOfficeClientId: "3bug83m4vi0j030qikm703k87n",
  AppKeys: {
    APP_LAUNCHED: "app-launched",
    Drawer_Key: "IsCashDrawerAttached",
    PO_USER: "POUSR_BO",
    REFRESH_TOKEN: "REF_TOKEN",
    ID_TOKEN_BO: "ID_TOKEN_BO",
    Device_Key: "user_token",
    counterTerminalId: "terminalID",
    branch_id: "custom:branch_id",
    node_id: "custom:node_id",
    deviceType: "custom:type",
    branchID: "custom:branch_id",
    branchName: "custom:branch_name",
    branchAddress: "custom:branch_address",
    branchPostcode: "custom:branch_postcode",
    branchUnitCode: "custom:branch_unit_code",
    branchUnitCodeVer: "custom:branch_unit_code_ver",
    deviceLoginId: "deviceLoginId",
    basketId: "basketId",
    nextScreen: "nextScreen",
  },
  autoFinishTransactionTime: 3000,
  featureFlags: {
    selfRegisterButtons: "SelfRegisterButtons",
  },
  // maxValue for currencyInput
  CONST0011: 99999.99,
  Roles: {
    AccessConfig: ["Admin"],
  },
};

export default APP_CONSTANTS;
