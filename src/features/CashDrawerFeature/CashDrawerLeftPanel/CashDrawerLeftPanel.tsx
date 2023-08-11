import { STRING_CONSTANTS } from "@ct/constants";
import { Center, Text } from "native-base";

export const CashDrawerLeftPanel = () => {
  return (
    <>
      <Center flex={1}>
        <Text testID="cashdrawer_text1" fontSize={28}>
          {STRING_CONSTANTS.CashDrawerScreen.DisplayText1}
        </Text>
        <Text testID="cashdrawer_text2" fontSize={28}>
          {STRING_CONSTANTS.CashDrawerScreen.DisplayText2}
        </Text>
      </Center>
    </>
  );
};
