import { BackOfficePageEnum } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { envProvider } from "@ct/common/platformHelper";
import { handleBackOfficeClick, setItem } from "@ct/utils";

// Use Home screen service URL for same
export const openBackOfficeForPreparePouchList = async () => {
  setItem(STORAGE_KEYS.CTSTK0003, BackOfficePageEnum.pouchPreperation);
  setTimeout(async function () {
    if (envProvider.REACT_APP_USING_ELECTRON === "true") {
      window.electronAPI?.launchBo();
      return;
    }
    await handleBackOfficeClick();
  }, 500);
};
