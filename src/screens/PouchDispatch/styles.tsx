import { StyleSheet } from "react-native";
import { Styles } from "../../constants";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  pageContainer: {
    flexDirection: "row",
  },
  preparePouchListView: {
    backgroundColor: colorConstants.white,
    height: verticalScale(1003),
    flexDirection: "row",
  },
  leftPanelContainer: {
    backgroundColor: colorConstants.cashDrawerLeftContainer,
    width: scale(Styles.leftPanelWidth),
    height: verticalScale(1003),
  },
  justifyContentCenter: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  enterBarcodeMsg: {
    fontSize: 24,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    textAlign: "center",
  },
  amountActionButtonView: {
    flexDirection: "row",
    position: "absolute",
    bottom: verticalScale(28),
  },
  transferButton: {},
  bthWidth: {
    width: scale(176),
  },
  confirmBtn: {
    marginLeft: scale(24),
  },
  btmCancelBtn: {
    width: scale(176),
    marginLeft: scale(168),
    backgroundColor: colorConstants.white,
    borderRadius: scale(4),
    borderWidth: 1,
    borderColor: colorConstants.receiptBorder,
  },
  cancelBtnText: {
    color: colorConstants.black,
    fontSize: 27,
  },
  rightPanelContainer: {
    backgroundColor: colorConstants.white,
    width: scale(Styles.rightPanelWidth),
    height: verticalScale(1003),
    flex: 1,
  },
  dropdown: {
    height: verticalScale(90),
    width: scale(389),
    borderColor: colorConstants.scanBorderColor,
  },
  dropdownTxt: {
    fontSize: 18,
  },
  inputBarcodeLabel: {
    justifyContent: "center",
    marginBottom: verticalScale(30),
    width: scale(519),
  },
  inputBarcodeInput: {
    width: scale(230),
    marginRight: scale(30),
  },
  inputBarcodeContainer: {
    backgroundColor: colorConstants.white,
    marginTop: verticalScale(446),
    justifyContent: "center",
    alignItems: "center",
  },
  inputBarcodeSubContainer: {
    backgroundColor: colorConstants.white,
    marginTop: verticalScale(22),
    height: verticalScale(746),
    justifyContent: "center",
    alignItems: "center",
  },
  LatestbuttonContainer: {
    marginTop: verticalScale(30),
    width: scale(242),
  },

  horizontalLineContainer: {
    width: scale(600),
    marginTop: verticalScale(50),
    alignSelf: "center",
  },
  inputBarcode: {},

  proceedBtnView: {
    marginTop: verticalScale(30),
    height: verticalScale(96),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  prepareBtnView: {
    marginTop: "58%",
    height: verticalScale(96),
    width: scale(607),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  redBg: {
    backgroundColor: colorConstants.PrimayCommanButtonColor,
  },
  cancelbtn: {
    backgroundColor: colorConstants.white,
    width: scale(176),
    borderWidth: 2,
    borderColor: colorConstants.cancelBtnBorderColor,
    marginLeft: scale(110),
    marginTop: "58%",
  },

  btnWidth: {
    width: scale(176),
  },

  pouchScanBtn: {
    marginRight: scale(80),
    marginTop: verticalScale(30),
  },
  btn: {
    width: scale(176),
  },
  cancelTxt: {
    color: colorConstants.black,
  },
  ProceedTxt: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontSize: 28,
  },
  inputField: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    borderRadius: scale(4),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colorConstants.mainTextColour,
    width: scale(539),
  },

  btncontainerMain: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(20),
  },
  Button: {
    flex: 1,
    paddingRight: scale(50),
  },
  ListContainer: {},
  leftPanelHeight: {
    width: scale(1027),
    marginTop: verticalScale(37),
    marginLeft: scale(84),
  },

  successBg: {
    backgroundColor: colorConstants.primarySuccessColour,
  },
  pouchValueView: {
    textAlign: "left",
    textAlignVertical: "center",
    width: scale(519),
  },
  pouchDetailContainer: {
    flexDirection: "column",
    marginTop: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  pouchDetailSubContainer: {
    flexDirection: "row",
    width: scale(519),
    marginTop: verticalScale(30),
    alignSelf: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: colorConstants.white,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colorConstants.cancelBtnBorderColor,
    height: verticalScale(96),
    width: scale(242),
  },
  proceedBtn: {
    backgroundColor: colorConstants.PrimayCommanButtonColor,
    height: verticalScale(96),
    width: scale(242),
    marginLeft: scale(30),
  },
  cancelButtonTxt: {
    color: colorConstants.black,
  },
  dispatchPouchView: {
    marginTop: scale(37),
    width: scale(640),
    marginLeft: scale(36),
  },

  accBarCodeTitleTxt: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontSize: 24,
    color: colorConstants.black,
    textAlign: "center",
  },

  accBarCodeTitleTxtView: {
    alignSelf: "center",
    marginBottom: scale(30),
    width: scale(377),
  },

  matchAnyTxt: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontSize: 24,
    textAlign: "center",
  },
  supportTxt: {
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontSize: 24,
    color: colorConstants.black,
    textAlign: "center",
  },
  btmSupport: {
    bottom: scale(35),
    alignSelf: "center",
    position: "absolute",
    justifyContent: "center",
  },

  preparePouchCancel: {
    width: scale(400),
    backgroundColor: colorConstants.black,
    borderColor: colorConstants.cancelBtnBorderColor,
    borderWidth: scale(2),
  },
  preparePouchBtn: {
    marginLeft: scale(61),
    marginTop: "58%",
  },
});
