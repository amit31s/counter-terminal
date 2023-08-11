import { StyleSheet } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  listHeight: {
    height: verticalScale(700),
  },
  boxView: {
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colorConstants.white,
    borderColor: colorConstants.borderColor,
  },
  buttonPressed: {
    backgroundColor: colorConstants.receiptBackgroud,
  },
  tableRow: {
    height: scale(72),
    padding: scale(22),
    marginBottom: scale(9),
  },
  tableRowWidth1: {
    width: "40%",
  },
  primaryText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontSize: 18,
  },
  tableRowHeaderText: {
    color: colorConstants.secondaryColour,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 18,
    fontWeight: "700",
  },
  flexRow: {
    flexDirection: "row",
  },
});
