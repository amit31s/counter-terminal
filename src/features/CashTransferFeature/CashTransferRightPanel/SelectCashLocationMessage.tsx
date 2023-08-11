import { TEXT } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";

export const SelectCashLocationMessage = () => {
  return (
    <Center testID="test-select-cash-location-message" px="10px" flex={1}>
      <Text
        fontSize="26px"
        fontWeight={700}
        fontFamily={FontFamily.FONT_NUNITO_BOLD}
        textAlign={"center"}
      >
        {TEXT.CTTXT00068}
      </Text>
    </Center>
  );
};
