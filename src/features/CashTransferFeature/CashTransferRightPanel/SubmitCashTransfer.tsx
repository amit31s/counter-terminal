import { TransferCore, usePostTransferTransactionHook } from "@ct/api/generator";
import {
  CustomButton,
  cashTransferSelector,
  getStockUnitIdentifier,
  useAppDispatch,
  useAppSelector,
} from "@ct/common";
import { CashLocation, setCashTransferred } from "@ct/common/state/cashTransfer/cashTransfer.slice";
import { StyledButtonProps } from "@ct/components";
import { CustomModal } from "@ct/components/CustomModal";
import { BUTTON, COLOR_CONSTANTS, SCREENS, TEXT } from "@ct/constants";
import { DeviceAttributes } from "@ct/interfaces";
import { poundToPence, uuid } from "@ct/utils";
import { FontFamily } from "@ct/utils/Scaling/FontFamily";
import { getUserName } from "@ct/utils/Services/auth";
import { logManager } from "@pol/frontend-logger-web";
import { get } from "lodash";
import { Flex, Text } from "native-base";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Modal = {
  isVisible?: boolean;
  message?: string;
};
interface SubmitCashTransferProps {
  amount: number;
}

// prepare cash transfer payload based on below page
// https://pol-jira.atlassian.net/wiki/spaces/SPM/pages/10691412138/Sample+Data+and+item+ids+for+Non-Sales+Transactions+Transfer+API
const cashTransferPayload = async (
  selectedCashLocation: CashLocation,
  amount: number,
  device: DeviceAttributes,
): Promise<TransferCore> => {
  const sourceStockUnitIdentifier = getStockUnitIdentifier();
  const destsourceStockUnitIdentifier = selectedCashLocation.accountingLocationID;

  const payload: TransferCore = {
    id: uuid(),
    itemID: "1",
    quantity: -1,
    valueInPence: -poundToPence(amount),
    transactionMode: 13,
    stockunitIdentifier: sourceStockUnitIdentifier,
    fadCode: device.branchID,
    additionalItems: [
      {
        itemID: "6277",
        valueInPence: poundToPence(amount),
        quantity: 1,
      },
      {
        itemID: "1",
        valueInPence: poundToPence(amount),
        quantity: 1,
        tokens: {
          transactionMode: 7,
          stockunitIdentifierDest: destsourceStockUnitIdentifier,
        },
      },
      {
        itemID: "6276",
        valueInPence: -poundToPence(amount),
        quantity: -1,
        tokens: {
          transactionMode: 7,
          stockunitIdentifierDest: destsourceStockUnitIdentifier,
        },
      },
    ],
    tokens: {
      operationType: "transfer_out",
      stockunitIdentifier: sourceStockUnitIdentifier,
      stockunitIdentifierDest: destsourceStockUnitIdentifier,
      transferAt: "Counter Terminal",
      userName: getUserName(),
    },
  };
  return payload;
};

export const SubmitCashTransfer = ({ amount }: SubmitCashTransferProps) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal>({});
  const dispatch = useAppDispatch();
  const { device } = useAppSelector((rootState) => rootState.auth);
  const cashTransfer = useSelector(cashTransferSelector);
  const selectedItem = cashTransfer.selectedItem;
  const transfer = usePostTransferTransactionHook();
  const isDisabled = !amount;
  const appLogger = logManager(LOGGER_TYPE.applicationLogger);

  const submitCashTransfer = async () => {
    try {
      const payload = await cashTransferPayload(selectedItem, amount, device);
      await transfer(payload);
      dispatch(setCashTransferred());
    } catch (error) {
      appLogger.error({
        methodName: "submitCashTransfer",
        error: error as Error,
      });
      const message = get(error, "response.data.message", TEXT.CTTXT00025);
      setModal({ isVisible: true, message });
    }
  };

  const cancelCashTransfer = () => {
    navigate(SCREENS.HOME, { state: { from: SCREENS.CASH_TRANSFER } });
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
      <Flex direction="row" alignContent={"flex-end"} justifyContent={"center"}>
        <CustomButton
          mt="30px"
          onChange={cancelCashTransfer}
          testID={BUTTON.CTBTN0006}
          buttonId={BUTTON.CTBTN0006}
          bg={COLOR_CONSTANTS.buttonColors.white}
          borderColor={COLOR_CONSTANTS.cancelBtnBorderColor}
          borderWidth={1}
        >
          <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} color={COLOR_CONSTANTS.black}>
            {BUTTON.CTBTN0006}
          </Text>
        </CustomButton>
        <CustomButton
          marginLeft="30px"
          isDisabled={isDisabled}
          mt="30px"
          onChange={submitCashTransfer}
          testID={BUTTON.CTBTN0008}
          buttonId={BUTTON.CTBTN0008}
          bg={isDisabled ? COLOR_CONSTANTS.disableBtnColor : COLOR_CONSTANTS.buttonColors.teritary}
        >
          <Text
            fontFamily={FontFamily.FONT_NUNITO_BOLD}
            color={isDisabled ? COLOR_CONSTANTS.disabledTextColour : COLOR_CONSTANTS.white}
          >
            {BUTTON.CTBTN0008}
          </Text>
        </CustomButton>
      </Flex>
      <CustomModal
        testID="cashdrawer_error_scanner"
        title={modal.message}
        primaryButtonProps={primaryButtonProps}
        isOpen={modal.isVisible}
      />
    </>
  );
};
