/* istanbul ignore file */

import { featureFlags } from "@ct/constants";
import isElectron from "is-electron";
import { envProvider } from "./platformHelper";

const forgeRockRedirectUrl =
  envProvider.NODE_ENV === "development" || isElectron()
    ? envProvider.REACT_APP_FORGEROCK_COGNITO_REDIRECT_ELECTRON
    : envProvider.REACT_APP_FORGEROCK_COGNITO_REDIRECT_SIM;

// should contain backend urls for different environments to make switching easier
export const SERVER_ROOT: string = `https://api.spm-${envProvider.REACT_APP_ENV}.com` || "";

export const AWS_COGNITO_REGION: string = envProvider.REACT_APP_AWS_COGNITO_REGION || "";
export const AWS_COGNITO_USER_POOL_ID: string =
  envProvider.REACT_APP_AWS_COGNITO_USER_POOL_ID || "";
export const AWS_COGNITO_WEB_CLIENT_ID: string =
  envProvider.REACT_APP_AWS_COGNITO_WEB_CLIENT_ID || "";

export const FORGEROCK_COGNITO_REGION: string =
  envProvider.REACT_APP_FORGEROCK_COGNITO_REGION || "";
export const FORGEROCK_COGNITO_USER_POOL_ID: string =
  envProvider.REACT_APP_FORGEROCK_COGNITO_USER_POOL_ID || "";
export const FORGEROCK_COGNITO_WEB_CLIENT_ID: string =
  envProvider.REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID || "";
export const FORGEROCK_COGNITO_OAUTH_DOMAIN: string =
  envProvider.REACT_APP_FORGEROCK_COGNITO_OAUTH_DOMAIN || "";
export const FORGEROCK_COGNITO_S3_BUCKET: string =
  envProvider.REACT_APP_FORGEROCK_COGNITO_S3_BUCKET || "";
export const FORGEROCK_COGNITO_REDIRECT: string = forgeRockRedirectUrl || "";

const federationManagerUrlLocal = "http://localhost:4000/apps/federation-manager";
const federationManagerUrlDeployed =
  (envProvider.REACT_APP_USING_ELECTRON === "true"
    ? envProvider.REACT_APP_FEDERATION_MANAGER_URL_STANDALONE
    : envProvider.REACT_APP_FEDERATION_MANAGER_URL_SIMULATOR) || "";

export const FEDERATION_MANAGER_URL: string = featureFlags?.useLocalFederationManager
  ? federationManagerUrlLocal
  : federationManagerUrlDeployed;

export const POL_DEVICE_SERVER_HOST: string = envProvider.REACT_APP_POL_DEVICE_SERVER_HOST || "";
export const POL_DEVICE_SERVER_SIMULATED: boolean =
  envProvider.REACT_APP_USING_ELECTRON === "true"
    ? envProvider.REACT_APP_POL_DEVICE_SERVER_SIMULATED_ELECTRON === "true"
    : envProvider.REACT_APP_POL_DEVICE_SERVER_SIMULATED_SIMULATOR === "true";
export const CASH_TRANSFER_OUT_DISABLED: boolean =
  envProvider.REACT_APP_CASH_TRANSFER_OUT_DIASBLED === "true" || false;
export const POUCH_ACCEPTANCE_DISABLED: boolean =
  envProvider.REACT_APP_POUCH_ACCEPTANCE_DISABLED === "true" || false;
export const LOGOUT_CASHDRAWER_DISABLED: boolean =
  envProvider.REACT_APP_LOGOUT_CASHDRAWER_DISABLED === "true" || false;
export const POUCH_DISPATCH_DISABLED: boolean =
  envProvider.REACT_APP_POUCH_DISPATCH_DISABLED === "true" || false;
export const PMS_VISIBLE: boolean = envProvider.REACT_APP_PMS_VISIBLE === "true" || false;
export const QUANTITY_BUTTON_DISABLED: boolean =
  envProvider.REACT_APP_QUANTITY_BUTTON_DISABLED === "true" || false;
export const INITIALISE_PED_ON_LOGIN: boolean =
  envProvider.REACT_APP_INITIALISE_PED_ON_LOGIN === "true" || false;
// allows for local override of tpv for pin pad
export const POL_PED_TPV_OVERRIDE: string = envProvider.REACT_APP_POL_PED_TPV_OVERRIDE || "";
export const MSR_ENABLED: boolean = envProvider.REACT_APP_MSR_ENABLED === "true" || false;
export const REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID =
  envProvider.REACT_APP_FORGEROCK_COGNITO_WEB_CLIENT_ID;
