import { STORAGE_KEYS } from "@ct/common/enums";
import { getItem } from "@ct/utils";
import { envProvider } from "./platformHelper";

export enum BackOfficePageEnum {
  taskManagement = "taskManagement",
  pouchPreperation = "pouchPreperation",
}

export const generateBackOfficeURL = () => {
  const currentPage = getItem(STORAGE_KEYS.CTSTK0003);
  const deviceFadcode = getItem(STORAGE_KEYS.CTSTK0004);
  return `${envProvider.REACT_APP_BACK_OFFICE_URL}/${currentPage}?navigatedFromCT=true&fadcode=${deviceFadcode}`;
};
