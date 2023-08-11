import FontFamily from "@ct/utils/Scaling/FontFamily";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  notificationHolder: {
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  warningIconHolder: {
    flex: 0.7,
  },
  warningIcon: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textHolder: {
    flex: 10,
    margin: "3%",
  },
  titleText: {
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 24,
    textAlign: "left",
  },
  bodyText: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontSize: 24,
  },
  closeIconHolder: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "2%",
    flex: 1,
  },
});
