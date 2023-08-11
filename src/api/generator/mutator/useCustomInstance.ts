import { replaceJWTTokens } from "@ct/common/helpers/replaceJWTTokens";
import { envProvider } from "@ct/common/platformHelper";
import { logManager } from "@pol/frontend-logger-web";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";

import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { setFadCodeInHeader } from "./setFadCodeInHeader";
import { setTokens } from "./setTokens";
import { setUrl } from "./setUrl";

type UseCustomInstance<T> = T & {
  httpStatus: number;
};

const baseURL = `https://api.spm-${envProvider.REACT_APP_ENV}.com`;

export const AXIOS_INSTANCE = Axios.create({ baseURL });
const logger = logManager(LOGGER_TYPE.apiLogger);
export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig,
) => Promise<UseCustomInstance<T>>) => {
  AXIOS_INSTANCE.interceptors.request.use(
    (value) => {
      logger.info({
        methodName: "Api request:",
        message: replaceJWTTokens(value),
      });
      return value;
    },
    (error) => {
      logger.error({
        methodName: "Api request error:",
        error: replaceJWTTokens(error),
      });
      throw error;
    },
  );

  AXIOS_INSTANCE.interceptors.response.use(
    (response) => {
      logger.info({
        methodName: "Api response:",
        message: replaceJWTTokens(response),
      });
      return response;
    },
    (error) => {
      logger.error({
        methodName: "Api response error:",
        error: replaceJWTTokens(error),
      });
      throw error;
    },
  );

  return async (config: AxiosRequestConfig) => {
    config.url = setUrl(config.url);
    await setTokens(config.url);
    setFadCodeInHeader(config.url);
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      cancelToken: source.token,
    }).then(({ data }) => data);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    promise.cancel = () => {
      source.cancel("Query was cancelled by React Query");
    };

    return promise;
  };
};

export default useCustomInstance;

interface AxiosError<T> {
  config: AxiosRequestConfig;
  code?: string;
  request?: unknown;
  response?: AxiosResponse<T>;
}

export type ErrorType<Error> = AxiosError<Error>;
