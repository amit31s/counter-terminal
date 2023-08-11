import { StyledErrorInfoOutlinedIcon, StyledLinkPrintOutlinedIcon } from "@ct/assets/icons";
import { useAppDispatch, useGetUser } from "@ct/common";
import { CustomModal } from "@ct/components";
import { SubmitPouchModal } from "@ct/components/SubmitPouchModal";
import { SCREENS, TEXT } from "@ct/constants";
import { SubmitPouchButton } from "@ct/features/PouchManagement";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  alertModalButton,
  showAvailablePouchModalPrimaryButton,
  showAvailablePouchModalSecondaryButton,
  submitPouchModalCancelButton,
  submitPouchModalConfirmWithoutPrintPrimaryButton,
  submitPouchModalFinishButton,
  submitPouchModalPrimaryButton,
  submitPouchModalSecondaryButton,
} from "../PouchAcceptanceModals/PouchAcceptanceScreenModalsButtons";
import { useGetPouchForAcceptance } from "../useGetPouchForAcceptance";
import { validateAndPreparePayloadForPouchAcceptance } from "./preparePayloadForPouchAcceptance";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { APP_LOGS_FN, APP_LOGS_MSG } from "@ct/common/constants/AppLogger";
import { PouchAcceptanceDetails, usePostTransferTransactionHook } from "@ct/api/generator";
import { get } from "lodash";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";

export type PouchDataForAcceptanceSuccess = PouchAcceptanceDetails & {
  basketId?: string;
};

const submitPouchModalConfig = ({
  openModal = false,
  status = "",
  onPrint = false,
  onReprint = false,
  onConfirm = false,
  onCancel = false,
}) => {
  return {
    openModal: openModal,
    status: status,
    onPrint: {
      enable: onPrint,
      title: TEXT.CTTXT00058,
    },
    onReprint: {
      enable: onReprint,
      title: TEXT.CTTXT00062,
    },
    onConfirm: {
      enable: onConfirm,
      title: TEXT.CTTXT00061,
    },
    onCancel: {
      enable: onCancel,
      title: TEXT.CTTXT00060,
    },
  };
};

export const SubmitPouch = () => {
  const applicationLogger = logManager(LOGGER_TYPE.applicationLogger);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { device } = useGetUser();
  const postTransferTransaction = usePostTransferTransactionHook();
  const [submitSuccessModal, setSubmitSuccessModal] = useState(false);
  const [submitFailedModal, setSubmitFailedModal] = useState(false);
  const [submitFailureMessage, setSubmitFailureMessage] = useState<string>("");
  const [successPouchList, setSuccessPouchList] = useState<PouchDataForAcceptanceSuccess[]>([]);
  const [submitPouchModalState, setSubmitPouchModalState] = useState(
    submitPouchModalConfig({ openModal: false }),
  );
  const [disabled, setDisabled] = useState(false);
  const { validatedData } = useGetPouchForAcceptance();
  const receiptService = useReceiptService();

  const printPouchAcceptance = useCallback(async () => {
    const printResponse = await receiptService.printReceipt({
      template: "counter-terminal/pouch-acceptance",
      context: {
        branchAddress:
          device.branchName + ", " + device.branchAddress + ", " + device.branchPostcode,
        fad: device.branchID,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        pouches: validatedData.map((pouch) => ({ id: pouch.pouchID })),
        pouchCount: validatedData.length,
      },
    });

    printResponse?.result?.printed
      ? setSubmitPouchModalState(
          submitPouchModalConfig({ onPrint: true, openModal: true, status: "onPrint" }),
        )
      : setSubmitPouchModalState(
          submitPouchModalConfig({ onReprint: true, openModal: true, status: "onReprint" }),
        );
  }, [
    device.branchAddress,
    device.branchID,
    device.branchName,
    device.branchPostcode,
    receiptService,
    validatedData,
  ]);

  const submitPouchForAcceptance = async () => {
    // setDisabled(true);
    const listOfPouchSuccess: PouchDataForAcceptanceSuccess[] = [];
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
          pouch,
          device.branchID,
          "acceptance",
        );
        if (!data) {
          applicationLogger.info({
            methodName: APP_LOGS_FN.submitPouchForAcceptance,
            message: APP_LOGS_MSG.invalidPayloadForPouchAcceptance,
            data: pouch,
          });
          continue;
        }
        // for testing uncomment below line
        // data.id = "360770925514#acceptance";
        const result = await postTransferTransaction(data);
        listOfPouchSuccess.push({ ...pouch, basketId: result.basketId });
      } catch (error) {
        const errorCode = get(error, "response.data.errorCode");
        failMsg = `${failMsg}${TEXT.CTTXT00083(pouch.pouchID, errorCode)}\n`;
        applicationLogger.fatal({
          methodName: APP_LOGS_FN.submitPouchForAcceptance,
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

  const getSubmitPouchContent = () => {
    switch (submitPouchModalState.status) {
      case "onPrint":
        return submitPouchModalState.onPrint;
      case "onReprint":
        return submitPouchModalState.onReprint;
      case "onConfirm":
        return submitPouchModalState.onConfirm;
      case "onCancel":
        return submitPouchModalState.onCancel;
      default:
        return undefined;
    }
  };

  const cancel = () => {
    navigate(SCREENS.HOME, { state: { from: SCREENS.POUCH_ACCEPTANCE } });
  };

  const getContentSize = () => {
    return submitPouchModalState.onCancel.enable
      ? "small"
      : submitPouchModalState.onReprint.enable
      ? "large"
      : "medium";
  };

  const handlePrimaryButtonProps = () => {
    return submitPouchModalState.onPrint.enable
      ? submitPouchModalPrimaryButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          submitPouchForAcceptance();
        })
      : submitPouchModalState.onReprint.enable
      ? submitPouchModalConfirmWithoutPrintPrimaryButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          submitPouchForAcceptance();
        })
      : submitPouchModalState.onConfirm.enable
      ? submitPouchModalFinishButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          navigate(SCREENS.HOME, { state: { from: SCREENS.POUCH_ACCEPTANCE } });
        })
      : submitPouchModalState.onCancel.enable
      ? showAvailablePouchModalPrimaryButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          cancel();
        })
      : undefined;
  };

  const handleSecondaryButtonProps = () => {
    return submitPouchModalState.onReprint.enable
      ? submitPouchModalSecondaryButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          printPouchAcceptance();
        })
      : submitPouchModalState.onCancel.enable
      ? showAvailablePouchModalSecondaryButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
        })
      : undefined;
  };

  const handleOtherButtonProps = () => {
    return submitPouchModalState.onPrint.enable || submitPouchModalState.onReprint.enable
      ? submitPouchModalCancelButton(() => {
          setSubmitPouchModalState(submitPouchModalConfig({ openModal: false }));
          setSubmitPouchModalState(
            submitPouchModalConfig({ openModal: true, onCancel: true, status: "onCancel" }),
          );
        })
      : undefined;
  };

  const submitPouchModalIcon = () => {
    return submitPouchModalState.onPrint.enable ? (
      <StyledLinkPrintOutlinedIcon />
    ) : submitPouchModalState.onReprint.enable ? (
      <StyledErrorInfoOutlinedIcon />
    ) : undefined;
  };

  useEffect(() => {
    if (!submitFailureMessage && !submitSuccessModal && successPouchList.length) {
      setSubmitPouchModalState(
        submitPouchModalConfig({ openModal: true, onConfirm: true, status: "onConfirm" }),
      );
    }
  }, [submitFailureMessage, submitSuccessModal, successPouchList.length]);

  return (
    <>
      <SubmitPouchButton submit={printPouchAcceptance} disabled={disabled} />
      {/* Pouch submitted */}
      <CustomModal
        testID={TEXT.CTTXT00024}
        title={TEXT.CTTXT00024}
        isOpen={submitSuccessModal}
        primaryButtonProps={alertModalButton(() => {
          setDisabled(false);
          setSubmitSuccessModal(false);
          navigate(SCREENS.HOME, { state: { from: SCREENS.POUCH_ACCEPTANCE } });
        })}
      />
      {/* something went wrong or any other error */}
      <CustomModal
        testID={submitFailureMessage}
        title={TEXT.CTTXT00085}
        content={submitFailureMessage}
        contentSize="large"
        isOpen={submitFailedModal}
        primaryButtonProps={alertModalButton(() => {
          setDisabled(false);
          setSubmitFailedModal(false);
          setSubmitFailureMessage("");
        })}
      />
      {/* Submit pouch modal */}
      <SubmitPouchModal
        testID={getSubmitPouchContent()?.title}
        title={getSubmitPouchContent()?.title}
        isOpen={submitPouchModalState.openModal}
        contentSize={getContentSize()}
        icon={submitPouchModalIcon()}
        primaryButtonProps={handlePrimaryButtonProps()}
        secondaryButtonProps={handleSecondaryButtonProps()}
        otherButtonProps={handleOtherButtonProps()}
      />
    </>
  );
};
