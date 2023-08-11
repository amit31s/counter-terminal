import { envProvider } from "@ct/common/platformHelper";

export const baseUrl = (() => {
  if (envProvider.REACT_APP_USING_ELECTRON === "true") {
    return envProvider.REACT_APP_FORGEROCK_COGNITO_REDIRECT_ELECTRON;
  }
  if (envProvider.REACT_APP_USING_WEB_LOCAL === "true") {
    return envProvider.REACT_APP_FORGEROCK_COGNITO_REDIRECT_SIM_LOCAL;
  }
  return envProvider.REACT_APP_FORGEROCK_COGNITO_REDIRECT_SIM;
})();

export const federationConfig = {
  redirectSignIn: `${baseUrl}/auth-redirect`,
  redirectSignOut: `${baseUrl}/signout-redirect`,
  withToken:
    envProvider.REACT_APP_USING_ELECTRON === "true" || process.env.NODE_ENV === "development",
} as const;
