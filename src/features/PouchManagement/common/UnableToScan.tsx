import { STRING_CONSTANTS, TEXT } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";

export const UnableToScan = () => {
  return (
    <Center testID="callBCS">
      <Text fontSize={24} fontWeight={600} fontFamily={FontFamily.FONT_NUNITO_REGULAR}>
        {STRING_CONSTANTS.messages.Unabletoscan}
      </Text>
      <Text fontSize={24} fontWeight={600} fontFamily={FontFamily.FONT_NUNITO_SEMI_BOLD}>
        {TEXT.CTTXT00040}
      </Text>
    </Center>
  );
};
