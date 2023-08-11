import { colorConstants } from "@ct/constants";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputStyle: {
    minHeight: 0,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: colorConstants.blue,
  },
  touchable: {
    flex: 1,
    height: 85,
    flexShrink: 0,
    marginBottom: 12,
    marginRight: 12,
  },
  btnWrapper: {
    width: "100%",
    borderRadius: 6,
    elevation: 0,
  },
  numberBtn: {
    borderColor: colorConstants.buttonColors.teritary,
    width: "100%",
    backgroundColor: colorConstants.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    minHeight: 72,
  },
  outlined: {
    borderColor: colorConstants.buttonColors.teritary,
    borderWidth: 2.5,
  },
  outlinedDisabled: {
    borderWidth: 2,
    borderColor: colorConstants.buttonColors.disabled.whiteBorder,
    backgroundColor: colorConstants.buttonColors.disabled.white,
  },
  filled: {},
  filledDisabled: {
    backgroundColor: colorConstants.disableBtnColor,
  },
  text: {
    fontSize: 24,
  },
});

export default styles;
