import { PouchDataForDespatch } from "@ct/api/generator";
import { StyledErrorPrintOutlinedIcon } from "@ct/assets/icons";
import { useAppDispatch, useGetUser } from "@ct/common";
import {
  LoadingId,
  setLoadingActive,
  setLoadingInactive,
} from "@ct/common/state/loadingStatus.slice";
import { SCREENS, TEXT, stringConstants } from "@ct/constants";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type PouchDataForDispatchSuccess = PouchDataForDespatch & {
  basketId?: string;
};

function useSubmitPouchPrintingModals(
  successPouchList: PouchDataForDispatchSuccess[],
  setSuccessPouchList: Dispatch<SetStateAction<PouchDataForDispatchSuccess[]>>,
  setDisabled: Dispatch<SetStateAction<boolean>>,
  submitFailedModal: boolean,
) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const receiptService = useReceiptService();

  const { device } = useGetUser();

  const [submitSuccessModal, setSubmitSuccessModal] = useState(false);

  useEffect(() => {
    if (!submitFailedModal && successPouchList.length && !submitSuccessModal) {
      (async () => {
        setSubmitSuccessModal(true);
        const receiptDefinition = {
          template: "counter-terminal/pouch-despatch",
          context: {
            branchAddress:
              device.branchName + ", " + device.branchAddress + ", " + device.branchPostcode,
            fad: device.branchID,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            pouches: successPouchList.map((pouch) => ({ id: pouch.pouchID })),
            pouchCount: successPouchList.length,
            session: successPouchList[successPouchList.length - 1].basketId,
            templateTitle: stringConstants.Pouch.templateTitlePouchDispatch,
          },
        };

        // Printing twice is purposeful
        await receiptService.printReceipt(receiptDefinition);
        await receiptService.printReceipt(receiptDefinition);

        const finishModalSpec = {
          id: LoadingId.POUCH_DESPATCH,
          modalProps: {
            title: "",
            icon: false,
            content: TEXT.CTTXT0057,
            primaryButtonProps: {
              label: TEXT.CTTXT0055,
              onPress: async () => {
                setDisabled(false);
                setSuccessPouchList([]);
                setSubmitSuccessModal(false);
                navigate(SCREENS.HOME);
                dispatch(setLoadingInactive(LoadingId.POUCH_DESPATCH));
              },
            },
          },
        };

        dispatch(
          setLoadingActive({
            id: LoadingId.POUCH_DESPATCH,
            modalProps: {
              title: "",
              icon: <StyledErrorPrintOutlinedIcon />,
              content: TEXT.CTTXT0056,
              secondaryButtonProps: {
                label: TEXT.CTTXT0053,
                onPress: async () => {
                  // Printing twice is purposeful
                  await receiptService.printReceipt(receiptDefinition);
                  await receiptService.printReceipt(receiptDefinition);
                },
              },
              primaryButtonProps: {
                label: TEXT.CTTXT0054,
                onPress: async () => {
                  dispatch(setLoadingActive(finishModalSpec));
                },
              },
            },
          }),
        );
      })();
    }
  }, [
    device.branchAddress,
    device.branchID,
    device.branchName,
    device.branchPostcode,
    dispatch,
    navigate,
    receiptService,
    setDisabled,
    setSuccessPouchList,
    submitFailedModal,
    submitSuccessModal,
    successPouchList,
  ]);
}

export default useSubmitPouchPrintingModals;
