import { STRING_CONSTANTS } from "@ct/constants";
import { Text, View } from "native-base";
import { StyledTransactionCompletedIcon } from "@ct/assets/icons";

export const TransactionCompleted = () => {
  return (
    <View flex={1} height="750px" justifyContent={"center"} alignItems={"center"}>
      <StyledTransactionCompletedIcon />

      <View>
        <Text textAlign="center" mt="20px">
          {STRING_CONSTANTS.transactionComplete}
        </Text>
      </View>
    </View>
  );
};
