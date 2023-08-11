import { StyleSheet } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: scale(20),
    minHeight: verticalScale(74),
    marginTop: verticalScale(10),
    backgroundColor: colorConstants.white,
  },
  emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: "center",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  pouchValue: {
    paddingRight: "13%",
    textAlign: "right",
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  primaryText: {
    textAlign: "center",
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 20,
  },

  itemStyle: {
    flex: 1,
    justifyContent: "space-evenly",
    textAlignVertical: "center",
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    color: colorConstants.mainTextColour,
    marginTop: verticalScale(22),
  },

  pouchTypeValue: {
    marginRight: scale(55),
    textAlign: "center",
    textTransform: "capitalize",
  },

  headerFooterStyle: {
    width: "100%",
    height: scale(77),
    color: colorConstants.mainTextColour,
  },

  border: {
    borderRadius: 4,
    borderColor: colorConstants.scanBorderColor,
    borderWidth: 1,
  },
  textStyle: {
    flex: 1,
    justifyContent: "space-evenly",
    lineHeight: 38,
    paddingVertical: scale(15),
  },
  actionStyle: {
    width: "12%",
    justifyContent: "center",
    alignItems: "center",
  },
});
