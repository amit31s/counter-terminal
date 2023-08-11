import { PouchAcceptanceDetailsItems } from "@ct/api/generator";
import { ERROR } from "@ct/common/enums";
import { Linking } from "react-native";
import { v4 } from "uuid";
import { AppConstants, stringConstants } from "../constants";
import { penceToPound } from "./Services";
import { getItem } from "./Storage";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { MISC_LOGS_FN } from "@ct/common/constants/MiscLogs";
const miscLogger = logManager(LOGGER_TYPE.miscLogger);

export const getOldIDTokenBO = async (): Promise<string> => {
  const token = await getItem(AppConstants.AppKeys.ID_TOKEN_BO);
  return token;
};

export const openUrl = (url: string) => {
  Linking.openURL(url);
};

export const removeLineBreaks = (str: string) => {
  return str.replace(/[\r\n]+/gm, "");
};

export const uuid = () => {
  return v4();
};

export const priceToRender = (value: number) => {
  try {
    if (value < 0) {
      return `-${stringConstants.Symbols.Pound}${penceToPound(Math.abs(value) || 0)}`;
    }
    return `${stringConstants.Symbols.Pound}${penceToPound(value || 0)}`;
  } catch (err) {
    miscLogger.fatal({
      methodName: MISC_LOGS_FN.priceToRender,
      error: err as Error,
    });
    return `${stringConstants.Symbols.Pound} 0`;
  }
};

export const getAdditionalItems = (items: PouchAcceptanceDetailsItems) => {
  if (!items) {
    return;
  }
  return Object.values(items);
};

export const isNetworkError = (error: unknown): boolean => {
  if (
    error === ERROR.NETWORK_ERROR ||
    (error instanceof Error && error.message.includes(ERROR.NETWORK_ERROR)) ||
    (typeof error === "string" && error.includes(ERROR.NETWORK_ERROR))
  ) {
    return true;
  }

  return false;
};

export const stringify = (obj: unknown) => {
  let cache: unknown[] | null = [];
  const str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache?.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
};
