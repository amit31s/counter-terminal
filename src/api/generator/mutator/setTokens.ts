import { getDeviceToken, getUserIdToken } from "@ct/utils/Services/auth";
import { AXIOS_INSTANCE } from "./useCustomInstance";

const setAuthorizationToken = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const setUserAuthorizationInUser = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common.User = token;
};

const unsetAuthTokens = () => {
  delete AXIOS_INSTANCE.defaults.headers.common.Authorization;
  delete AXIOS_INSTANCE.defaults.headers.common.UserAuthorization;
  delete AXIOS_INSTANCE.defaults.headers.common.User;
};

export const setTokens = async (url = "") => {
  const userToken = getUserIdToken();
  const deviceToken = getDeviceToken();

  unsetAuthTokens();
  switch (true) {
    case url.includes("/transactions/v3/"):
    case url === "/bm-accounting-location/v1/dissociation-counter":
    case url === "/bm-accounting-location/v1/association":
      deviceToken && setAuthorizationToken(deviceToken);
      userToken && setUserAuthorizationInUser(userToken);
      break;
    // set only user token in Authorization
    case url === "transfer/v1/transaction":
    case url.includes("/bm-accounting-location"):
    case url.includes("/branch/"):
      userToken && setAuthorizationToken(userToken);
      break;
    // set only user token in Authorization for cash schema DB changes
    case url.includes("/bm-pouch-management"):
      userToken && setAuthorizationToken(userToken);
      break;
    case url.includes("acc-card/validate"):
      break;
    default:
      // set only device token in Authorization
      deviceToken && setAuthorizationToken(deviceToken);
      break;
  }
};
