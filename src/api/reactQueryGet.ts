import { getBaseURL } from "@ct/constants";
import { provideHeader } from "@ct/utils/Services/httpRequest/HeaderHandler";
import axios from "axios";

export interface ReactQueryGetResponse {
  data: unknown;
  status: number;
}

export interface ReactQueryGetResponseOptional
  extends Omit<ReactQueryGetResponse, "data" | "status"> {
  data?: ReactQueryGetResponse["data"];
  status?: ReactQueryGetResponse["status"];
}

/*
  Decide base URL
*/
const getHTTPBaseUrl = (_type?: string): string => {
  return getBaseURL();
};

export const reactQueryGet = async (requestUrl: string, type?: string) => {
  const header = await provideHeader({}, {}, type);
  const { data, status } = await axios.get(getHTTPBaseUrl(type) + requestUrl, header);
  return { data, status };
};
