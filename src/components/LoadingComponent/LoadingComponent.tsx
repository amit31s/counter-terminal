import { colorConstants, stringConstants } from "@ct/constants";
import { Text, View } from "native-base";

// TODO: Confirm font Size for this component, 22 doesnt seem to be standard
export const LoadingComponent = () => {
  return (
    <View
      w="1950px"
      h="1080px"
      justifyContent={"center"}
      alignItems={"center"}
      testID="test-loading-component"
    >
      <Text color={colorConstants.black} fontSize="22px">
        {stringConstants.LoginScreen.Loading}
      </Text>
    </View>
  );
};
