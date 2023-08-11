import { PouchAcceptanceDetails, useGetAcceptanceValidateHook } from "@ct/api/generator";
import { ScannerInput } from "@ct/common";
import { STORAGE_KEYS } from "@ct/common/enums";
import { useAppDispatch } from "@ct/common/hooks";
import {
  setShowAvailablePouches,
  setValidatedData,
  setZerovaluePouch,
} from "@ct/common/state/pouchAcceptance/pouchAcceptanceFeature.slice";
import {
  resetFailureCount,
  updateFailureCount,
} from "@ct/common/state/pouchAcceptance/updateScannedPouchAcceptanceFeature.slice";
import { CustomModal } from "@ct/components";
import { TEXT } from "@ct/constants";
import { getItem } from "@ct/utils";
import { isEmpty } from "lodash";
import { Center } from "native-base";
import { useEffect, useState } from "react";
import {
  alertModalButton,
  branchValidationPrimaryPopupButton,
  branchValidationSecondaryPopupButton,
  showAvailablePouchModalPrimaryButton,
  showAvailablePouchModalSecondaryButton,
} from "../PouchAcceptanceModals/PouchAcceptanceScreenModalsButtons";
import { useGetPouchForAcceptance } from "../useGetPouchForAcceptance";
import { useGetScanPouchForAcceptance } from "../useGetScanPouchForAcceptance";
import { SubmitPouch } from "./SubmitPouch";

export const PouchAcceptanceScanner = () => {
  const [showInvalidPouchModal, setInvalidPouchModal] = useState(false);
  const [showDuplicatePouchModal, setDuplicatePouchModal] = useState(false);
  const [differentBranchPouchModal, setDifferentBranchPouchModal] = useState(false);
  const [showAvailablePouchModal, setAvailablePouchModal] = useState(false);
  const [validatedPouch, setValidatedPouch] = useState<void | PouchAcceptanceDetails>();

  const { validatedData, availablePouchData } = useGetPouchForAcceptance();
  const { failureCount } = useGetScanPouchForAcceptance();
  const getAcceptanceValidate = useGetAcceptanceValidateHook();
  const dispatch = useAppDispatch();

  const handlePouchAcceptanceScan = async (barcode: string) => {
    if (!barcode) {
      return;
    }

    const found = validatedData.find((element) => element.pouchID === barcode);
    if (found) {
      setDuplicatePouchModal(true);
      return;
    }

    const pouchFromAvailablePouchData = availablePouchData.filter(
      (element) => element.pouchID === barcode,
    );

    if (pouchFromAvailablePouchData.length) {
      const pouchValue = pouchFromAvailablePouchData[0].totalValue ?? 0;
      if (pouchValue === 0) {
        dispatch(setZerovaluePouch(pouchFromAvailablePouchData[0]));
      } else {
        dispatch(setValidatedData([...validatedData, pouchFromAvailablePouchData[0]]));
      }

      return;
    }

    const scannedPouchData = await getAcceptanceValidate(barcode);
    updateScannedPouch(scannedPouchData);
  };

  const updateScannedPouch = (scannedPouchData: void | PouchAcceptanceDetails) => {
    setValidatedPouch(scannedPouchData);
    if (!scannedPouchData) {
      setInvalidPouchModal(true);
      return;
    }
    // if pouch blongs to different branch
    // show confirmation modal
    if (
      scannedPouchData.assignedBranchID &&
      scannedPouchData.assignedBranchID.replaceAll(" ", "") !== getItem(STORAGE_KEYS.CTSTK0004)
    ) {
      setDifferentBranchPouchModal(true);
    }
  };

  const acceptDifferentBranchPouch = () => {
    if (!validatedPouch) {
      return;
    }

    const pouchData: PouchAcceptanceDetails = {
      assignedBranchID: validatedPouch?.assignedBranchID,
      assignedBranchName: validatedPouch?.assignedBranchName,
      deliveredBranchID: validatedPouch?.deliveredBranchID,
      isBranchValid: validatedPouch?.isBranchValid,
      isPouchValid: validatedPouch?.isPouchValid,
      isPouchValueAssociated: validatedPouch?.isPouchValueAssociated,
      pouchID: validatedPouch?.pouchID,
      status: validatedPouch?.status,
      totalValue: validatedPouch?.totalValue,
      transactionID: validatedPouch?.transactionID,
      itemID: validatedPouch?.itemID,
      updatedBy: validatedPouch?.updatedBy,
      items: validatedPouch?.items,
      pouchType: validatedPouch?.pouchType,
    };

    const pouchValue = validatedPouch?.totalValue ?? 0;
    if (pouchValue === 0) {
      dispatch(setZerovaluePouch(pouchData));
    } else {
      dispatch(setValidatedData([...validatedData, pouchData]));
    }
  };

  // update failure count to show available pouch list modal
  useEffect(() => {
    if (isEmpty(availablePouchData)) {
      return;
    }

    if (validatedData.length >= availablePouchData.length) {
      return;
    }
    if (failureCount >= 1) {
      setAvailablePouchModal(true);
      dispatch(resetFailureCount());
    }
  }, [availablePouchData, dispatch, failureCount, validatedData.length]);

  return (
    <>
      <Center px="16px" flex={1} testID="PouchAcceptanceScanner">
        <ScannerInput
          testID="PouchAcceptanceScannerInput"
          showIcon={false}
          onSubmitBarcode={handlePouchAcceptanceScan}
          forbiddenCharacterRegex={/[^0-9 ]/g}
        />
        {validatedData.length > 0 && <SubmitPouch />}
      </Center>
      {/* No match found! */}
      <CustomModal
        testID={TEXT.CTTXT00021}
        title={TEXT.CTTXT00021}
        isOpen={showInvalidPouchModal}
        primaryButtonProps={alertModalButton(() => {
          dispatch(updateFailureCount());
          setInvalidPouchModal(false);
        })}
      />
      {/* select from the list of pouches */}
      <CustomModal
        testID={TEXT.CTTXT00022}
        title={TEXT.CTTXT00022}
        isOpen={showAvailablePouchModal}
        primaryButtonProps={showAvailablePouchModalPrimaryButton(() => {
          dispatch(setShowAvailablePouches(true));
          dispatch(resetFailureCount());
          setAvailablePouchModal(false);
        })}
        secondaryButtonProps={showAvailablePouchModalSecondaryButton(() => {
          setAvailablePouchModal(false);
          dispatch(resetFailureCount());
        })}
      />
      {/* Duplicate pouch entry */}
      <CustomModal
        testID={TEXT.CTTXT00023}
        title={TEXT.CTTXT00023}
        isOpen={showDuplicatePouchModal}
        primaryButtonProps={alertModalButton(() => setDuplicatePouchModal(false))}
      />
      {/* different branch pouch cinfirmation */}
      <CustomModal
        testID={TEXT.CTTXT00027(validatedPouch?.assignedBranchID ?? "")}
        title={TEXT.CTTXT00027(validatedPouch?.assignedBranchID ?? "")}
        isOpen={differentBranchPouchModal}
        primaryButtonProps={branchValidationPrimaryPopupButton(() => {
          setDifferentBranchPouchModal(false);
          acceptDifferentBranchPouch();
        })}
        secondaryButtonProps={branchValidationSecondaryPopupButton(() => {
          setDifferentBranchPouchModal(false);
        })}
      />
    </>
  );
};
