import { SCREENS } from "@ct/constants";

export type StackParams = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.CASH_DRAWER]: undefined;
  [SCREENS.CASH_TRANSFER]: undefined;
  [SCREENS.RECEIPT]: undefined;
  [SCREENS.POUCH_ACCEPTANCE]: undefined;
  [SCREENS.POUCH_DESPATCH]: undefined;
  [SCREENS.PMS_MODULE]: undefined;
  [SCREENS.SYSTEM_INFO]: undefined;
  [SCREENS.SELF_REGISTER]: {
    url: string;
  };
  [SCREENS.AUTH_REDIRECT]: Record<string, string>;
};
