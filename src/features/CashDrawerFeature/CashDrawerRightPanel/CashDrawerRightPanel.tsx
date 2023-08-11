import { useAssociateCashDrawerCounterHook } from "@ct/api/generator";
import { ScannerInput } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { CustomModal, StyledButtonProps } from "@ct/components";
import { BUTTON, SCREENS, STRING_CONSTANTS } from "@ct/constants";
import { setItem } from "@ct/utils/Storage";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import { Center } from "native-base";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";

type Modal = {
  isVisible?: boolean;
  message?: string;
};

export const CashDrawerRightPanel = () => {
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);
  const [modal, setModal] = useState<Modal>({});
  const associateCashDrawerCounter = useAssociateCashDrawerCounterHook();
  const navigate = useNavigate();

  const associateCashDrawer = async (barcode: string) => {
    try {
      const requestBody = {
        cashDrawerID: barcode,
      };
      const apiResponse = await associateCashDrawerCounter(requestBody);
      appLogger.info({
        methodName: APP_LOGS_FN.associateCashDrawer,
        logData: { apiResponse, requestBody },
        message: APP_LOGS_MSG.cashDrawerAssociateSuccess,
      });
      setItem(STORAGE_KEYS.CTSTK0006, barcode);
      navigate(SCREENS.HOME, { state: { from: SCREENS.CASH_DRAWER } });
    } catch (e) {
      const failMessage = navigator.onLine
        ? STRING_CONSTANTS.messages.somethingWentWrong
        : STRING_CONSTANTS.CommitFailureModal.internetFailureContent;
      const message = get(e, "response.data.message", failMessage);
      appLogger.error({
        methodName: APP_LOGS_FN.associateCashDrawer,
        error: e as Error,
        message,
      });
      setModal({ isVisible: true, message });
    }
  };

  const primaryButtonProps: StyledButtonProps = {
    testID: BUTTON.CTBTN0016,
    label: BUTTON.CTBTN0016,
    onPress: () => {
      setModal({ isVisible: false });
    },
  };

  return (
    <>
      <Center px="32px" flex={1}>
        <ScannerInput
          testID="cashdrawer_scanner"
          showIcon={false}
          onSubmitBarcode={associateCashDrawer}
        />
      </Center>
      <CustomModal
        testID="cashdrawer_error_scanner"
        title={modal.message}
        primaryButtonProps={primaryButtonProps}
        isOpen={modal.isVisible}
      />
    </>
  );
};
