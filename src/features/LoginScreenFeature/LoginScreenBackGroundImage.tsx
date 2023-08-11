import { imageConstants, stringConstants } from "@ct/constants";
import { Image, View } from "native-base";

export const LoginScreenBackGroundImage = () => {
  return (
    <View position={"absolute"} w="100%" h="100%" justifyContent="center" alignItems="center">
      <Image
        testID={stringConstants.LoginScreenTestIds.LoginScreenBackGroundImage}
        source={imageConstants.Login.home_image}
        w="105%"
        h="105%"
        maxW="105%"
        maxH="105%"
        resizeMode="cover"
        alt="A blurred image of several people in an Post Office branch"
      />
      <Image
        testID={stringConstants.LoginScreenTestIds.LoginScreenShadowImage}
        source={imageConstants.Login.shadow_image}
        position={"absolute"}
        w="100%"
        h="100%"
        resizeMode="cover"
        alt="A shadow to darken the background image"
      />
    </View>
  );
};
