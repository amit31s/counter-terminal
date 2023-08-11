import { authService } from "@ct/utils/Services/auth";
import { stringConstants } from "../../../constants";
import { getOldIDTokenBO } from "../../utils";

export const getTokenHeader = {
  headers: {
    "content-type": " application/x-amz-json-1.1",
    "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
  },
};

/* 
    Provide header based on request type 
  */
export const provideHeader = async (configOptions = {}, headerOptions = {}, type?: string) => {
  let token: string;

  if (type === stringConstants.requestType.transactionEngine) {
    const idToken = (await authService.getIdToken()) as string;
    if (idToken) {
      token = idToken;
    } else {
      throw "idToken not found in provideHeader";
    }
  } else if (type === stringConstants.requestType.backOfficeRedirect) {
    return getTokenHeader;
  } else {
    token = await getOldIDTokenBO();
  }

  return {
    ...configOptions,
    headers: {
      ...headerOptions,
      Authorization: `Bearer ${token}`,
    },
  };
};
