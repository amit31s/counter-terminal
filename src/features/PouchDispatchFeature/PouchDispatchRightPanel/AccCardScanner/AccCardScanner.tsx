import {
  PouchDespatchList,
  useGetAccCardDataHook,
  useGetDespatchListHook,
} from "@ct/api/generator";
import { ScannerInput, getAccCard, useAppSelector } from "@ct/common";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import {
  resetAccFailureCount,
  updateAccCard,
  updateAccFailureCount,
} from "@ct/common/state/pouchDispatch/accCardFeature.slice";
import { updateAvailablePouchData } from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { CustomModal, StyledButtonProps } from "@ct/components";
import { BUTTON, TEXT, stringConstants } from "@ct/constants";
import { UnableToScan } from "@ct/features/PouchManagement";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import { Center } from "native-base";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useState } from "react";
import { useDispatch } from "react-redux";

const appLogger = logManager(LOGGER_TYPE.applicationLogger);

type Modal = {
  isVisible?: boolean;
  message?: string;
};

export const AccScanner = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<Modal>({});
  const { failureCount } = useAppSelector(getAccCard);
  const receiptService = useReceiptService();
  const { device } = useAppSelector((rootState) => rootState.auth);
  const getAccCardData = useGetAccCardDataHook();
  const listPreparedPouches = useGetDespatchListHook();

  const printReceipt = (data: PouchDespatchList) => {
    receiptService.printReceipt({
      template: "counter-terminal/pouch-despatch",
      context: {
        branchAddress:
          device.branchName + ", " + device.branchAddress + ", " + device.branchPostcode,
        fad: device.branchID,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pouches: data.map((pouch) => ({ id: pouch.pouchID })),
        pouchCount: data.length,
        templateTitle: stringConstants.Pouch.templateTitlePouchDispatch,
      },
    });
  };

  const processWithValidatedCard = async () => {
    try {
      const data = await fetchPouchAvailableList();
      if (data && data.length) {
        dispatch(updateAvailablePouchData(data));
        dispatch(resetAccFailureCount());
        printReceipt(data);
      }
    } catch (error) {
      appLogger.error({
        methodName: "processWithValidatedCard",
        error: error as Error,
      });
    }
  };

  const validateACCBarcode = async (barcode: string) => {
    try {
      const data = await getAccCardData({ barcode });
      if (!data) {
        dispatch(updateAccFailureCount());
        setModal({ isVisible: true, message: TEXT.CTTXT00021 });
        return;
      }
      dispatch(updateAccCard({ barcode, scanned: true }));
      processWithValidatedCard();
    } catch (error) {
      appLogger.error({
        methodName: "validateACCBarcode",
        error: error as Error,
      });
      const message = get(error, "response.data.message", TEXT.CTTXT00025);
      setModal({ isVisible: true, message });
    }
  };

  const fetchPouchAvailableList = async () => {
    dispatch(setLoadingActive({ id: LoadingId.LOAD_POUCH_TO_DISPATCH }));
    try {
      const availablePouch = await listPreparedPouches();
      if (!availablePouch || !Array.isArray(availablePouch)) {
        return;
      }
      const nonZeroPouches = availablePouch.filter(({ totalValue }) => Number(totalValue) !== 0);
      if (nonZeroPouches.length === 0) {
        return;
      }
      return nonZeroPouches;
    } catch (error) {
      appLogger.error({
        methodName: "fetchPouchAvailableList",
        error: error as string,
      });
      return;
    } finally {
      dispatch(setLoadingInactive(LoadingId.LOAD_POUCH_TO_DISPATCH));
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
      <Center px="16px" flex={1}>
        <ScannerInput
          showIcon={false}
          onSubmitBarcode={validateACCBarcode}
          placeholder={stringConstants.Input.scannerPlaceholderTxtColor}
        />
      </Center>
      {failureCount >= 3 && <UnableToScan />}
      <CustomModal
        testID={modal.message}
        title={modal.message}
        isOpen={modal.isVisible}
        primaryButtonProps={primaryButtonProps}
      />
    </>
  );
};
