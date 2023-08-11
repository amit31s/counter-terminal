import { TEXT } from "@ct/constants";
import { Center, Text } from "native-base";
import { BackToHome } from "./BackToHome";
import { StyledTransactionCompletedIcon } from "@ct/assets/icons";

export const CashTransferSuccess = () => {
  return (
    <>
      <Center testID="test-cash-transfer-success" px="10px" flex={1} maxHeight="780px">
        <StyledTransactionCompletedIcon />
        <Text mt="40px" variant="large">
          {TEXT.CTTXT00067}
        </Text>
      </Center>
      <BackToHome />
    </>
  );
};
