import { getBaseURL } from "@ct/constants";
import { provideHeader } from "@ct/utils/Services/httpRequest/HeaderHandler";
import axios from "axios";

/*
  Decide base URL
*/
const getHTTPBaseUrl = (_type?: string): string => {
  return getBaseURL();
};

export const reactQueryPost = async (request: string, data: unknown, type?: string) => {
  const header = await provideHeader({}, {}, type);
  return await axios.post(getHTTPBaseUrl(type) + request, data, header);
};
