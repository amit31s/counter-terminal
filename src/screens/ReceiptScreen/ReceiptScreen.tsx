import { Screen, useAppDispatch } from "@ct/common";
import {
  PrintedReceipt,
  purgeOutdatedReceipts,
} from "@ct/common/state/ReceiptScreen/printedReceipts.slice";
import { CustomModal, StyledButton } from "@ct/components";
import { SCREENS, STRING_CONSTANTS, colorConstants, stringConstants } from "@ct/constants";
import { useReceiptService } from "@ct/utils/Services/ReceiptService";
import { Box } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigate } from "react-router-dom";
import ReceiptList from "./ReceiptList";
import ReceiptPreview from "./ReceiptPreview";

const buttonStyles = StyleSheet.create({
  base: {
    width: 320,
  },
});

const { ReceiptViewer } = STRING_CONSTANTS.screenNames;

const ReceiptScreen = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<PrintedReceipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(purgeOutdatedReceipts());
  }, [dispatch]);

  const receiptService = useReceiptService();
  const navigate = useNavigate();

  return (
    <Screen title={ReceiptViewer}>
      <Box
        testID={stringConstants.ReceiptList.testID}
        flex={1}
        bgColor={colorConstants.cashDrawerLeftContainer}
        p="48px"
      >
        <Box flexDir="row" flex={1} mb="48px">
          <ReceiptList selectedReceipt={selectedReceipt} setSelectedReceipt={setSelectedReceipt} />
          <ReceiptPreview selectedReceipt={selectedReceipt} />
        </Box>
        <Box flexDir="row" justifyContent="space-between">
          <StyledButton
            label="Close"
            type="tertiary"
            styles={buttonStyles.base}
            onPress={() => {
              navigate(SCREENS.HOME, { state: { from: SCREENS.RECEIPT } });
            }}
          />
          <StyledButton
            label="Print"
            type="tertiary"
            styles={buttonStyles.base}
            isDisabled={selectedReceipt === null}
            onPress={() => {
              setShowReceiptModal(true);
            }}
          />
        </Box>
      </Box>
      <CustomModal
        isOpen={showReceiptModal}
        testID={stringConstants.ReceiptList.printModalTestID}
        content={stringConstants.ReceiptList.reprintPrompt}
        primaryButtonProps={{
          label: "Yes",
          onPress: () => {
            if (selectedReceipt) {
              receiptService.printReceipt({
                template: selectedReceipt.templateId,
                context: {
                  ...selectedReceipt.context,
                  isDuplicate: true,
                  dateOfIssue: Date.now() / 1000,
                },
              });
            }

            setShowReceiptModal(false);
          },
        }}
        secondaryButtonProps={{
          label: "Cancel",
          onPress: () => {
            setShowReceiptModal(false);
          },
        }}
        contentSize="medium"
      />
    </Screen>
  );
};

export default ReceiptScreen;
