import { STRING_CONSTANTS } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";

export const NoPouchScanned = () => {
  return (
    <Center flex={1}>
      <Text fontSize={28} fontFamily={FontFamily.FONT_NUNITO_BOLD}>
        {STRING_CONSTANTS.PouchAcceptance.scanOrEnterBarcode1}
      </Text>
      <Text fontSize={28} fontFamily={FontFamily.FONT_NUNITO_BOLD}>
        {STRING_CONSTANTS.PouchAcceptance.scanOrEnterBarcode2}
      </Text>
    </Center>
  );
};
