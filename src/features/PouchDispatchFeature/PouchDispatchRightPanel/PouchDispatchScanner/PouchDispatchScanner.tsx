import { useGetDespatchValidateHook } from "@ct/api/generator";
import { getPouchDispatchList, ScannerInput } from "@ct/common";
import { useAppDispatch, useAppSelector } from "@ct/common/hooks";
import {
  updateShowAvailablePouches,
  updateValidatedData,
} from "@ct/common/state/pouchDispatch/pouchDispatchFeature.slice";
import { CustomModal } from "@ct/components";
import { stringConstants, TEXT } from "@ct/constants";
import {
  showAvailablePouchModalPrimaryButton,
  showAvailablePouchModalSecondaryButton,
} from "@ct/features/PouchAcceptanceFeature/PouchAcceptanceModals/PouchAcceptanceScreenModalsButtons";
import { Center } from "native-base";
import { useState } from "react";
import { alertModalButton } from "../pouchDispatchModalButtons";
import { SubmitPouch } from "../SubmitPouch";

export const PouchDispatchScanner = () => {
  const { showAvailablePouches, availablePouchData, validatedData } =
    useAppSelector(getPouchDispatchList);
  const dispatch = useAppDispatch();

  const [showInvalidPouchModal, setInvalidPouchModal] = useState(false);
  const [showDuplicatePouchModal, setDuplicatePouchModal] = useState(false);
  const [showAvailablePouchModal, setAvailablePouchModal] = useState(false);
  const validatePouch = useGetDespatchValidateHook();

  const isPrepaidPouchAvailable = () => {
    const validatedBarcodes = validatedData.map((validatedPouch) => validatedPouch.pouchID);
    const preparedPouches = availablePouchData.filter(
      (availablePouch) => !validatedBarcodes.includes(availablePouch.pouchID),
    );
    return preparedPouches.length > 0;
  };

  const handlePouchDispatchScan = async (barcode: string) => {
    if (!barcode) {
      return;
    }

    const found = validatedData.find((element) => element.pouchID === barcode);
    if (found) {
      setDuplicatePouchModal(true);
      return;
    }

    const foundInAvailablePouches = availablePouchData.find(
      (element) => element.pouchID === barcode,
    );

    if (foundInAvailablePouches) {
      dispatch(updateValidatedData([...validatedData, foundInAvailablePouches]));
      return;
    }

    const data = await validatePouch(barcode);
    if (!data) {
      if (!isPrepaidPouchAvailable()) {
        setInvalidPouchModal(true);
        return;
      }
      setAvailablePouchModal(true);
      return;
    }
    dispatch(updateValidatedData([...validatedData, data]));
  };

  return (
    <>
      {!showAvailablePouches && availablePouchData.length > 0 && (
        <>
          <Center px="16px" flex={1} testID="PouchDispatchScanner">
            <ScannerInput
              testID="PouchDispatchScannerInput"
              showIcon={false}
              onSubmitBarcode={handlePouchDispatchScan}
              placeholder={stringConstants.Input.barCodePlaceholder}
              forbiddenCharacterRegex={/[^0-9 ]/g}
            />
          </Center>
          <SubmitPouch />
          {/* No match found */}
          <CustomModal
            testID={TEXT.CTTXT00030}
            title={TEXT.CTTXT00030}
            isOpen={showInvalidPouchModal}
            primaryButtonProps={alertModalButton(() => {
              setInvalidPouchModal(false);
            })}
          />
          {/* Duplicate pouch entry */}
          <CustomModal
            testID={TEXT.CTTXT00023}
            title={TEXT.CTTXT00023}
            isOpen={showDuplicatePouchModal}
            primaryButtonProps={alertModalButton(() => setDuplicatePouchModal(false))}
          />

          {/* select from the list of prepared pouches? */}
          <CustomModal
            testID={TEXT.CTTXT00026}
            title={TEXT.CTTXT00026}
            isOpen={showAvailablePouchModal}
            primaryButtonProps={showAvailablePouchModalPrimaryButton(() => {
              dispatch(updateShowAvailablePouches(true));
              setAvailablePouchModal(false);
            })}
            secondaryButtonProps={showAvailablePouchModalSecondaryButton(() => {
              setAvailablePouchModal(false);
            })}
          />
        </>
      )}
    </>
  );
};
