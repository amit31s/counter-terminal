import { StyleSheet } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  boxView: {
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colorConstants.white,
    borderColor: colorConstants.scanBorderColor,
  },
  tableRow: {
    height: verticalScale(72),
    padding: scale(22),
    marginBottom: scale(10),
    justifyContent: "space-evenly",
  },
  width50: {
    width: "33%",
  },

  pouchType: {
    display: "flex",
  },
  primaryText: {
    color: colorConstants.secondaryColour,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontSize: 20,
  },
  barcodeTxtText: {
    color: colorConstants.secondaryColour,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 18,
  },
  tableRowHeaderText: {
    color: colorConstants.secondaryColour,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 18,
  },
  textAlignRight: {
    textAlign: "right",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  pouchTypeValue: {
    marginRight: scale(45),
    textAlign: "center",
    textTransform: "capitalize",
  },
  flexRow: {
    flexDirection: "row",
  },
});
