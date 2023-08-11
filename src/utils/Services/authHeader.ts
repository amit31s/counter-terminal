import "react-native-get-random-values";
import { v4 } from "uuid";
import { getDeviceToken } from "./auth";

interface MinimumHeader {
  Authorization: string;
  [key: string]: string;
}

export const authHeadersWithDeviceToken = async (): Promise<MinimumHeader> => {
  return {
    "X-Correlation-ID": v4(),
    Authorization: `Bearer ${getDeviceToken()}`,
  };
};
