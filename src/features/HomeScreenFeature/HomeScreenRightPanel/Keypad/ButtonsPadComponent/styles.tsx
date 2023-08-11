import { KEYPAD_BUTTON_HEIGHT } from "@ct/constants/KeypadConstants";
import { StyleSheet } from "react-native";
import { colorConstants } from "../../../../../constants";
import FontFamily from "../../../../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../../../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  pageContainer: {
    backgroundColor: colorConstants.textboxBackgroundColour,
    flexDirection: "row",
  },
  leftPanelContainer: {
    backgroundColor: colorConstants.mainBackGroundColor,
    width: scale(1063),
    height: verticalScale(1003),
  },
  rightPanelContainer: {
    backgroundColor: colorConstants.homePageRightPaneColor,
    width: scale(857),
    height: verticalScale(1003),
  },
  itemListContainer: {
    height: verticalScale(545),
  },
  customKeypadAndButtonCOntainer: {
    backgroundColor: colorConstants.homePageRightPaneColor,
    flexDirection: "row",
  },
  rightPanelButtonContainer: {
    marginTop: verticalScale(15),
    marginLeft: scale(50),
  },
  inputButtonContainer: {
    width: scale(998),
    marginLeft: scale(31),
    marginTop: verticalScale(17),
    flexDirection: "row",
  },

  inputContainer: {
    width: 891,
  },

  buttonPanelLeftContainer: {
    width: scale(998),
    marginLeft: scale(31),
    marginTop: verticalScale(22),
  },
  upperButtonContainer: {
    flexDirection: "row",
    height: verticalScale(400),

    flexWrap: "wrap",
  },
  leftPanelButton: {
    marginLeft: verticalScale(10),
  },
  lowerButtonContainer: {
    flexDirection: "row",
    height: verticalScale(400),

    flexWrap: "wrap",
    marginTop: verticalScale(300),
  },
  inputBorder: {
    borderColor: colorConstants.scanBorderColor,
    borderRightWidth: 0,
  },
  buttonContainer: {
    padding: "4%",
    width: "50%",
  },
  bottomButtonContainer: {
    paddingLeft: "1%",
    marginTop: "14%",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomButtonContainerSub: {
    paddingLeft: "1%",
    marginTop: "0.5%",
    flexDirection: "row",
  },
  bottomButtonsView: {
    margin: "0.5%",
  },
  bottomButtonsViewEmpty: {
    width: 100,
    height: 120,
  },
  buttonDirection: {
    flexDirection: "row",
    width: "40%",
  },
  // start from here: deepika
  leftPane: {
    width: "53%",
  },
  rightPane: {
    marginLeft: "1.2%",
    marginTop: verticalScale(5),
    width: "44%",
  },
  itemTable: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: colorConstants.numberPadTableColor,
  },
  tableBorder: {
    borderColor: colorConstants.numberPadTableColor, // not beeing used
  },
  tableHeader: {
    height: verticalScale(50),
    flexDirection: "row",
  },
  tableRowContainer0: {
    height: verticalScale(148), // 154
    flexDirection: "row",
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRowContainer1: {
    height: verticalScale(56),
    marginTop: verticalScale(2),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRowContainer2: {
    height: verticalScale(63),
    marginTop: verticalScale(2),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRowContainer3: {
    height: verticalScale(56),
    marginTop: verticalScale(2),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRowContainer4: {
    height: verticalScale(56),
    marginTop: verticalScale(2),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRowContainer5: {
    height: verticalScale(70),
    marginTop: verticalScale(2),
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colorConstants.homePageRightPaneColor,
    backgroundColor: colorConstants.secondaryButtonColour,
  },
  tableRow: {
    justifyContent: "center",
  },
  textAlignVerticalCenter: {
    textAlignVertical: "center",
  },
  width50: {
    width: "52%",
  },

  totalItemRowMarginRight: {
    marginRight: scale(24),
  },
  totalItemColumnMarginRight: {
    marginRight: scale(30),
  },

  width10: {
    width: "12%",
  },
  width20: {
    width: "18%",
  },
  border0: {
    borderWidth: 0,
  },
  paddingLeft5: {
    padding: 5,
  },
  textCenter: {
    textAlign: "center",
  },
  txtRight: {
    textAlign: "right",
  },
  totalTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontSize: 30,
  },
  vatTxt: {
    // marginLeft: scale(40)
  },
  selfCenter: {
    alignSelf: "center",
  },
  keypadImage: {
    alignSelf: "center",
    width: 24,
  },
  textWhite: {
    color: colorConstants.white,
  },
  webActionBtn: {
    width: scale(96),
    height: verticalScale(96),
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: colorConstants.white,
    alignItems: "center",
    borderColor: colorConstants.receiptBorder,
    marginRight: scale(10),
    marginBottom: verticalScale(12),
    borderRadius: 6,
  },
  actionBtn: {
    width: scale(96),
    height: verticalScale(96),
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: colorConstants.white,
    alignItems: "center",
    borderColor: colorConstants.receiptBorder,
    marginRight: scale(10),
    marginBottom: verticalScale(12),
    borderRadius: 6,
  },
  actionBtnPressed: {
    borderColor: colorConstants.borderColorButton,
  },
  paymentBtn: {
    backgroundColor: colorConstants.primaryColour,
    borderColor: colorConstants.primaryColour,
  },
  enterButton: {
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  btnText: {
    fontSize: 24,
    textAlign: "center",
  },
  numberView: {
    flexDirection: "row",
  },
  numberBtn: {
    backgroundColor: colorConstants.white,
    width: scale(KEYPAD_BUTTON_HEIGHT),
    height: verticalScale(KEYPAD_BUTTON_HEIGHT),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colorConstants.receiptBorder,
    // shadowColor: "",
    marginRight: scale(12),
    marginBottom: verticalScale(12),
    borderRadius: 6,
    elevation: 1.2,
  },
  numberBtnZero: {
    width: scale(214),
  },
  buttonsPadView: {
    flexDirection: "column",
  },
  itemCol: {
    marginLeft: scale(30),
  },
  supportKeyContainer: {
    marginLeft: scale(25),
  },
  middleViewContainer: {
    paddingLeft: "1%",
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: colorConstants.textboxBackgroundColour,
  },
  textInputView: {
    height: "5%",
    paddingLeft: "1%",
  },
  middleButtonsView: {
    margin: "1.5%",
  },
  textView: {
    margin: "1%",
    width: "70%",
  },
  PrevBtn: {
    alignSelf: "center",
    width: scale(130),
    height: verticalScale(72),
  },
  logoutView: {
    paddingLeft: "1.5%",
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: colorConstants.textboxBackgroundColour,
  },
  cashDrawerView: {
    marginLeft: "4%",
  },
  tableHeaderText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 18,
  },
  tableText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontStyle: "normal",
    fontSize: 18,
  },

  mTop8: {
    marginTop: verticalScale(8),
  },
  itemMargin: {
    marginLeft: scale(34),
  },
  itemColMargin: {
    marginLeft: scale(24),
  },
  top12Bottom16: {
    marginBottom: verticalScale(16),
    marginTop: verticalScale(12),
  },
  firstItemRowView: {
    marginTop: verticalScale(14),
    marginBottom: verticalScale(24),
  },
  middleItem: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  btn: {
    backgroundColor: colorConstants.mainTextColour,
    height: verticalScale(89),
    marginTop: verticalScale(10),
    width: scale(242),
  },
  paymentBtnColor: {
    backgroundColor: colorConstants.primaryColour,
  },

  scan: {
    fontSize: 21,
    fontStyle: "normal",
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    color: colorConstants.black,
  },

  scanContainer: {
    borderRightWidth: 1,
    borderRightColor: colorConstants.scanBorderColor,
    borderTopWidth: 1,
    borderTopColor: colorConstants.scanBorderColor,
    borderBottomWidth: 1,
    borderBottomColor: colorConstants.scanBorderColor,
    backgroundColor: colorConstants.secondaryButtonColour,
    width: 107,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  verticleLine: {
    height: 30,
    width: 1,
    backgroundColor: colorConstants.seperatorColor,
  },
});
