import { StyleSheet } from "react-native";
import { colorConstants, Styles } from "../../constants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  eptyBsktTitle: {
    marginBottom: verticalScale(150),
    marginLeft: scale(32),
    fontSize: 29,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
  },
  imageCenterContainer: {
    alignItems: "center",
    marginBottom: verticalScale(38.06),
  },
  tenderInputText: {
    color: colorConstants.black,
    fontSize: 30,
    lineHeight: 28,
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
  },
  pageContainer: {
    backgroundColor: colorConstants.textboxBackgroundColour,
    flexDirection: "row",
    height: verticalScale(Styles.appHeight),
    width: scale(Styles.appWidth),
  },
  leftPanelContainer: {
    backgroundColor: colorConstants.cashDrawerLeftContainer,
    width: scale(Styles.leftPanelWidth),
    height: verticalScale(1003),
    borderColor: colorConstants.leftPanelColor,
    borderRightWidth: 3.5,
  },

  rightPanelContainer: {
    width: scale(Styles.rightPanelWidth),
    height: verticalScale(Styles.appHeight),
  },
  rightPanelMargin: {
    marginTop: verticalScale(17),
  },
  rightPanelContainerWebWidth: {
    width: scale(Styles.rightPanelWidth),
  },
  itemListContainer: {
    backgroundColor: colorConstants.white,
  },
  basketSectionHeight: {
    height: verticalScale(540),
  },
  emptybasketContainer: {
    backgroundColor: colorConstants.white,
    justifyContent: "center",
    marginTop: verticalScale(17),
    alignContent: "center",
  },
  customKeypadAndButtonCOntainer: {
    marginTop: verticalScale(30),
    flexDirection: "row",
    marginLeft: scale(35),
  },
  row: {
    flexDirection: "row",
  },
  btnPadView: {
    marginTop: verticalScale(10),
  },
  rightPanelButtonContainer: {
    // marginTop:verticalScale(35),
  },
  rightPanelButtonContainerLeftMargin: {
    marginLeft: scale(12),
  },
  inputButtonContainer: {
    width: "100%",
    marginLeft: scale(56),
    marginTop: verticalScale(56),
    flexDirection: "row",
  },
  customiseView: {
    flexDirection: "row",
    marginTop: verticalScale(25),
    marginRight: verticalScale(48),
  },
  journeyContainer: {
    backgroundColor: colorConstants.white,
    height: verticalScale(656),
    alignContent: "center",
    marginLeft: scale(48),
    marginRight: scale(46),
    marginTop: verticalScale(36),
  },
  mainJourneyView: {
    flexDirection: "row",
  },
  cancelJourney: {
    alignItems: "flex-end",
    marginTop: verticalScale(60),
    marginLeft: scale(1110),
    position: "absolute",
  },
  cancelIcon: {},
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
  inputContainer: {
    width: scale(815),
  },
  buttonPanelLeftContainer: {
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: verticalScale(22),
    flexDirection: "row",
  },
  upperButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  leftPanelButton: {
    marginLeft: verticalScale(10),
  },
  lowerButtonContainer: {
    flexDirection: "row",
  },
  inputBorder: {
    paddingLeft: scale(70),
    height: verticalScale(84),
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
    borderColor: colorConstants.numberPadTableColor,
  },
  tableHeader: {
    height: verticalScale(50),
    flexDirection: "row",
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
  textWhite: {
    color: colorConstants.primaryButtonTextColour,
  },
  actionBtn: {
    width: scale(107),
    height: verticalScale(90),
    borderWidth: 1,
    marginBottom: verticalScale(10),
    justifyContent: "center",
    backgroundColor: colorConstants.primaryButtonTextColour,
    alignItems: "center",
    borderColor: colorConstants.tenderingButtonTextColour,
    marginRight: scale(10),
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
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontStyle: "normal",
    fontSize: 28,
    textAlign: "center",
  },
  numberView: {
    flexDirection: "row",
    marginLeft: scale(10),
    backgroundColor: colorConstants.homePageRightPaneColor,
  },
  numberBtn: {
    backgroundColor: colorConstants.primaryButtonTextColour,
    width: scale(107),
    height: verticalScale(90),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colorConstants.receiptBorder,
    marginRight: scale(10),
    marginBottom: verticalScale(10),
  },
  numberBtnZero: {
    width: scale(214),
  },
  buttonsPadView: {
    flexDirection: "row",
    marginTop: verticalScale(24),
    marginLeft: scale(6),
    marginBottom: scale(6),
  },
  itemCol: {
    marginLeft: scale(30),
  },
  supportKeyContainer: {
    marginLeft: scale(50),
  },
  // End here: deepika
  TopViewContainer: {
    paddingLeft: "1%",
    marginTop: "1%",
    width: "50%",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: colorConstants.textboxBackgroundColour,
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
    fontSize: 18,
  },
  tableText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
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
  paymentHomeFinishBtn: {
    marginTop: verticalScale(12),
    marginRight: scale(10),
    width: scale(312),
    height: verticalScale(Styles.numpadBtnHeight),
    backgroundColor: colorConstants.primaryYesColour,
  },
  qtyBtn: {
    backgroundColor: colorConstants.white,
    marginTop: verticalScale(12),
    width: scale(312),
    height: verticalScale(Styles.numpadBtnHeight),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colorConstants.receiptBorder,
    borderRadius: 5,
  },
  qtyBtnTxt: {
    color: colorConstants.black,
  },
  qtyDiableBtnTxt: {
    color: colorConstants.disabledTextColour,
  },
  voidItemBtn: {
    height: verticalScale(Styles.numpadBtnHeight),
    width: scale(150),
  },
  voidBasketBtn: {
    height: verticalScale(Styles.numpadBtnHeight),
    width: scale(150),
    marginLeft: verticalScale(12),
  },
  actionsBtn: {
    flexDirection: "row",
    marginTop: verticalScale(12),
  },
  voidBtnButtonTxt: {
    lineHeight: verticalScale(30),
    marginTop: verticalScale(10),
  },

  logoutSecModalBtn: {
    width: scale(110),
  },
  logoutPrimaryModalBtn: {
    width: scale(116),
    marginRight: scale(24),
    backgroundColor: colorConstants.primaryYesColour,
  },

  voidItemSecModalBtn: {
    width: scale(116),
  },
  voidItemModalBtn: {
    width: scale(116),
    marginRight: scale(24),
    backgroundColor: colorConstants.primaryYesColour,
  },

  paymentBtnColor: {
    backgroundColor: colorConstants.primaryYesColour,
  },

  ValidationErrorPromaryBtn: {
    backgroundColor: colorConstants.primaryYesColour,
    width: scale(116),
    marginRight: scale(24),
  },
  basketWarning: {
    fontSize: 29,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    color: colorConstants.disabledTextColour,
    textAlign: "center",
    marginBottom: verticalScale(182),
  },
  customiseTxt: {
    color: colorConstants.borderColorButton,
    fontSize: 25,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    marginRight: scale(22),
  },
  backToHomeIcon: {},
});
