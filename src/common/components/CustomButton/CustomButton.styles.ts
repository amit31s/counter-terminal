import { colorConstants } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { StyleSheet } from "react-native";

export const customButtonStyles = StyleSheet.create({
  gradientButton: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowStyle: {
    backgroundColor: colorConstants.white,
    shadowColor: colorConstants.shadowColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.6,
  },
  Btntext: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
  },
});

export const shadowStyle = customButtonStyles.shadowStyle;
