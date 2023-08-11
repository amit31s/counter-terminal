import { StyleSheet } from "react-native";
import { scale } from "../utils/Scaling/ScalingUtility";
import colorConstants from "../constants/ColorConstants";
export default StyleSheet.create({
  darkHeader: {
    width: "100%",
    height: scale(32),
    backgroundColor: colorConstants.primaryDark,
  },
  headerContainer: {
    width: "100%",
    height: scale(52),
    backgroundColor: colorConstants.primaryColour,
  },
  header: {
    fontSize: 20,
    fontWeight: "normal",
    marginLeft: scale(40),
    marginTop: scale(10),
    color: colorConstants.white,
  },
});
