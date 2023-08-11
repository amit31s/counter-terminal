import { TEXT } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { Center, Text } from "native-base";

export const NoPouchScanned = () => {
  return (
    <Center flex={1} testID="pouchDispatchLeftPanel">
      <Text fontSize={28} fontFamily={FontFamily.FONT_NUNITO_BOLD} textAlign={"center"}>
        {TEXT.CTTXT00070}
      </Text>
    </Center>
  );
};
