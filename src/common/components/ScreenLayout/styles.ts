import { COLOR_CONSTANTS, Styles } from "@ct/constants";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  leftPanelContainer: {
    flex: 1,
    height: Styles.basketHeight,
    padding: "24px",
    backgroundColor: COLOR_CONSTANTS.primaryBlue20Percent,
    zIndex: 1,
  },

  rightPanelContainer: {
    width: Styles.basketWidth,
    height: Styles.basketHeight,
    backgroundColor: COLOR_CONSTANTS.white,
    padding: Styles.basketPadding,
  },
});
export default styles;
