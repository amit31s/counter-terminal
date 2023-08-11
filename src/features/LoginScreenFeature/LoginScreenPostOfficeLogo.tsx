import { colorConstants, imageConstants, stringConstants } from "@ct/constants";
import { Image, Text, View } from "native-base";

export const LoginScreenPostOfficeLogo = () => {
  return (
    <View testID={stringConstants.LoginScreenTestIds.PostOfficeLogoComponent} flex={1}>
      <View justifyContent={"center"} flex={1}>
        <Image
          testID={stringConstants.LoginScreenTestIds.PostOfficeLogo}
          source={imageConstants.Logo.post_office_home_logo}
          resizeMode="contain"
          alt="The Post Office logo"
          height="197px"
        />
        <View alignSelf={"center"} mt={8}>
          <Text
            fontSize="36px"
            fontFamily="body"
            fontWeight={700}
            color={colorConstants.textboxBackgroundColour}
          >
            {stringConstants.LoginScreen.WELCOME}
          </Text>
        </View>
      </View>
    </View>
  );
};
