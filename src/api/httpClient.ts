import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
const apiLogger = logManager(LOGGER_TYPE.apiLogger);

axios.interceptors.request.use(
  (req: AxiosRequestConfig) => {
    const loggerBody = {
      methodName: `HTTP ${req.method}`,
      url: req.url,
      data: "",
    };
    if (req.method === "post") {
      loggerBody.data = req.data;
    }
    apiLogger.info(loggerBody);
    return req;
  },
  (err: Error) => {
    const loggerBody = {
      error: err,
      methodName: "request",
    };
    apiLogger.error(loggerBody);
    return Promise.reject(err);
  },
);

axios.interceptors.response.use(
  (res: AxiosResponse) => {
    const loggerBody = {
      methodName: `HTTP ${res.config.method}`,
      url: res.config.url,
      status: JSON.stringify(res.status),
    };
    apiLogger.info(loggerBody);
    return res;
  },
  (err: Error) => {
    const loggerBody = {
      error: err,
      methodName: "response",
    };
    apiLogger.error(loggerBody);
    return Promise.reject(err);
  },
);

export type { AxiosResponse as httpResponse };
