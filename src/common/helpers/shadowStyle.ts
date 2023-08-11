import { colorConstants } from "@ct/constants";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
});

export const shadowStyle = styles.shadowStyle;
