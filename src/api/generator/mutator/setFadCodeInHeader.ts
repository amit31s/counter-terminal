// as in new cash DB schema we need to send fadcode in header
// but it is not generic for all endpoint
// for some APIs CT needs to send fadcode (Ex- cash drawer association/disassociation)
// for some APIs CT dont need to send fadcode (Ex- Create basket, close basket etc)
// May be later it would be generic for all API
// but for now we are deciding based on URL (When need to send fadCode)

import { STORAGE_KEYS } from "@ct/common/enums";
import { AXIOS_INSTANCE } from "./useCustomInstance";

export const setFadCodeInHeader = (url: string) => {
  switch (true) {
    case url.includes("/bm-accounting-location/"):
    case url.includes("/bm-pouch-management/"):
      setFadCode();
      break;
    default:
      removeFadCode();
  }
};

const setFadCode = () => {
  AXIOS_INSTANCE.defaults.headers.common.fadcode =
    localStorage.getItem(STORAGE_KEYS.CTSTK0004) ?? "fadCodeNotFound";
};

const removeFadCode = () => {
  delete AXIOS_INSTANCE.defaults.headers.common.fadcode;
};
