import { StyleSheet } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

const styles = (journeyStarted: boolean) =>
  StyleSheet.create({
    journeyContainer: {
      marginTop: journeyStarted ? 0 : 52,
      alignContent: "center",
      flex: 1,
    },
    cancelJourney: {
      top: verticalScale(10),
      right: scale(30),
      height: 32,
      position: "absolute",
    },
    complianceCont: {
      width: "85%",
      height: "75%",
      justifyContent: "center",
      marginLeft: "15%",
    },
    compWarning: {
      textAlign: "center",
      width: "90%",
      fontSize: 28,
      fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
      color: colorConstants.black,
    },
    cancelIcon: {
      width: 32,
      height: 32,
      padding: 10,
    },
    cancelIconWeb: {
      height: 29,
      width: 29,
      paddingRight: 30,
      paddingTop: 10,
      alignSelf: "center",
    },
  });

export default styles;
