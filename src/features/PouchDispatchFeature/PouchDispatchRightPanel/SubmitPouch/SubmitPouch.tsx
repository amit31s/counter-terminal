import { PouchAcceptanceStatus, usePostTransferTransactionHook } from "@ct/api/generator";
import { getPouchDispatchList, useAppDispatch, useAppSelector, useGetUser } from "@ct/common";
import { CustomModal } from "@ct/components";
import { TEXT } from "@ct/constants";
import { alertModalButton } from "@ct/features/PouchAcceptanceFeature/PouchAcceptanceModals/PouchAcceptanceScreenModalsButtons";
import { validateAndPreparePayloadForPouchAcceptance } from "@ct/features/PouchAcceptanceFeature/PouchAcceptanceRightPanel/preparePayloadForPouchAcceptance";
import useSubmitPouchPrintingModals, {
  PouchDataForDispatchSuccess,
} from "@ct/features/PouchDispatchFeature/PouchDispatchRightPanel/SubmitPouch/useSubmitPouchPrintingModals";
import { SubmitPouchButton } from "@ct/features/PouchManagement";
import { Flex } from "native-base";
import { useState } from "react";
import { logManager } from "@pol/frontend-logger-web";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { get } from "lodash";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";

export const SubmitPouch = () => {
  const { device } = useGetUser();
  const dispatch = useAppDispatch();
  const { validatedData } = useAppSelector(getPouchDispatchList);
  const postTransferTransaction = usePostTransferTransactionHook();
  const [submitFailedModal, setSubmitFailedModal] = useState(false);
  const [submitFailureMessage, setSubmitFailureMessage] = useState<string>("");
  const [disabled, setDisabled] = useState(false);
  const [successPouchList, setSuccessPouchList] = useState<PouchDataForDispatchSuccess[]>([]);
  const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);

  const submitPouchForDispatch = async () => {
    setDisabled(true);
    const listOfPouchSuccess: PouchDataForDispatchSuccess[] = [];
    let failMsg = "";
    dispatch(
      setLoadingActive({
        id: LoadingId.POUCH_SUBMIT,
        modalProps: {
          title: TEXT.CTTXT00064,
        },
      }),
    );
    for (const pouch of validatedData) {
      try {
        const data = validateAndPreparePayloadForPouchAcceptance(
          {
            ...pouch,
            isBranchValid: "true",
            isPouchValid: "true",
            isPouchValueAssociated: "true",
            status: PouchAcceptanceStatus.expected,
          },
          device.branchID,
          "despatch",
        );
        if (!data) {
          applicationLogger.info({
            methodName: APP_LOGS_FN.submitPouchForDispatch,
            message: APP_LOGS_MSG.invalidPayloadForPouchDispatch,
            data: pouch,
          });
          continue;
        }
        // for testing uncomment below line
        // data.id = "303053342401#despatch";
        const result = await postTransferTransaction(data);
        listOfPouchSuccess.push({ ...pouch, basketId: result.basketId });
      } catch (error) {
        const errorCode = get(error, "response.data.errorCode");
        failMsg = `${failMsg}${TEXT.CTTXT00083(pouch.pouchID, errorCode)}\n`;
        applicationLogger.fatal({
          methodName: APP_LOGS_FN.submitPouchForDispatch,
          error: error as Error,
        });
      }
    }
    dispatch(setLoadingInactive(LoadingId.POUCH_SUBMIT));
    if (failMsg) {
      setSubmitFailedModal(true);
      setSubmitFailureMessage(failMsg);
    }
    if (listOfPouchSuccess.length) {
      setSuccessPouchList(listOfPouchSuccess);
    }
  };

  useSubmitPouchPrintingModals(
    successPouchList,
    setSuccessPouchList,
    setDisabled,
    submitFailedModal,
  );

  if (!validatedData.length) {
    return <></>;
  }

  return (
    <Flex direction="row" justifyContent={"center"}>
      <SubmitPouchButton submit={submitPouchForDispatch} disabled={disabled} />
      {/* something went wrong or any other error */}
      <CustomModal
        testID={submitFailureMessage}
        title={TEXT.CTTXT00084}
        content={submitFailureMessage}
        contentSize="large"
        isOpen={submitFailedModal}
        primaryButtonProps={alertModalButton(() => {
          setDisabled(false);
          setSubmitFailedModal(false);
          setSubmitFailureMessage("");
        })}
      />
    </Flex>
  );
};
