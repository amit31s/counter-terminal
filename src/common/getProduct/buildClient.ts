import { authHeadersWithDeviceToken } from "@ct/utils/Services/authHeader";
import {
  enablerAPIClientFactory,
  EnablerAPIClientNames,
} from "postoffice-product-journey-api-clients";
import { SERVER_ROOT } from "../backendUrl";

export const tokeniserClient = enablerAPIClientFactory.buildClient(
  EnablerAPIClientNames.tokeniser,
  {
    rootUrl: SERVER_ROOT,
    authHeaders: authHeadersWithDeviceToken,
  },
);
