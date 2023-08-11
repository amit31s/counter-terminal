import { Styles } from "@ct/constants";
import { Platform, StyleProp, StyleSheet, ViewStyle } from "react-native";
import colorConstants from "../../constants/ColorConstants";
import FontFamily from "../../utils/Scaling/FontFamily";
import { scale, verticalScale } from "../../utils/Scaling/ScalingUtility";

export default StyleSheet.create({
  primaryButton: {
    backgroundColor: colorConstants.primaryColour,
    alignItems: "center",
    borderRadius: 2,
  },
  primaryButtonText: {
    color: colorConstants.primaryButtonTextColour,
    fontSize: 18,
    fontWeight: "bold",
    padding: "2%",
  },
  modalContainer: {
    justifyContent: "center",
    height: verticalScale(325),
    backgroundColor: colorConstants.selectedItemBackground,
    width: scale(594),
  },
  modalWebContainer: {
    justifyContent: "flex-end",
    height: Styles.quantityBoxHeight,
    backgroundColor: colorConstants.white,
    width: "100%",
    padding: 20,
  },
  topQuantityView: {
    flex: 1,
    justifyContent: "center",
  },
  successButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  toPay: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: verticalScale(10),
  },
  popupButtonView: {
    flex: 1,
    flexDirection: "row",
    marginTop: "20px",
    marginBottom: "20px",
    width: "100%",
  },
  popupHeaderText: {
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 28,
    textAlign: "center",
    color: colorConstants.mainTextColour,
    marginLeft: "8%",
    marginRight: "8%",
    marginTop: "5%",
  },
  headerText: {
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 24,
    textAlign: "left",
    color: colorConstants.alertTextColor,
    marginLeft: verticalScale(23),
    marginTop: verticalScale(15),
  },
  popupText: {
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontSize: 24,
    textAlign: "left",
    lineHeight: scale(34),
    color: colorConstants.mainTextColour,
    marginLeft: verticalScale(23),
    marginTop: verticalScale(35),
  },
  alertText: {
    height: 32,
    flexDirection: "row",
    backgroundColor: colorConstants.iconColors.errorRed,
    alignItems: "center",
    position: "absolute",
    paddingLeft: 5,
    margin: 20,
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputQtyView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityLayout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  minusImgWeb: {
    marginTop: 60,
  },
  minusImg: { height: verticalScale(62), width: scale(59) },
  plusImg: { height: verticalScale(62), width: scale(59) },
  alertPlusImg: { height: verticalScale(62), width: scale(59) },
  popupMsgTextView: {},
  circularBtn: {
    height: verticalScale(62),
    width: scale(62),
  },
  popupMsgText: {
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontSize: 21,
    textAlign: "left",
    paddingLeft: 5,
    color: colorConstants.white,
  },
  inputBox: {
    height: 72,
    alignSelf: "center",
    textAlign: "center",
    marginLeft: 24,
    marginRight: 24,
  },
  inputBoxDisable: {
    backgroundColor: colorConstants.alertItem,
    borderColor: colorConstants.alertBorder,
    borderWidth: 2,
    width: scale(104),
    height: verticalScale(72),
    alignSelf: "center",
    textAlign: "center",
    marginLeft: scale(30),
    marginRight: scale(30),
  },
  secBtn: {
    width: scale(174),
    height: verticalScale(70),
    borderColor: colorConstants.cancelBtnBorderColor,
  },
  primaryBtn: {
    backgroundColor: colorConstants.primaryYesColour,
    width: scale(187),
    height: verticalScale(72),
  },
  modalButton: {
    minWidth: scale(181),
  },
  popupSingleButtonView: {
    width: "40%",
  },
  pageContainer: {
    backgroundColor: colorConstants.textboxBackgroundColour,
    flexDirection: "row",
  },
  itemListContainer: {
    height: verticalScale(545),
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
  tableHeader: {
    height: verticalScale(62),
    flexDirection: "row",
    backgroundColor: colorConstants.basketHeader,
  },
  tableHeight: {
    height: verticalScale(452),
    marginLeft: scale(32),
  },

  tableToggleHeight: {
    height: verticalScale(634),
    marginLeft: scale(32),
  },
  basketTxt: {
    marginTop: verticalScale(32),
    marginBottom: verticalScale(24),
    fontSize: 29,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
  },

  scrollViewHeight: {
    height: verticalScale(286),
  },
  scrollToggleViewHeight: {
    height: verticalScale(420),
  },
  receiptscrollViewHeight: {
    maxHeight: verticalScale(420),
  },
  receiptTogglescrollViewHeight: {
    maxHeight: verticalScale(820),
  },
  CardScrollViewHeight: {
    maxHeight: verticalScale(80),
  },

  subTotalView: {
    height: verticalScale(60),
    flexDirection: "row",
    backgroundColor: colorConstants.toPay,
    marginTop: verticalScale(2),
  },

  vatView: {
    height: verticalScale(60),
    flexDirection: "row",
  },
  totalViewHeight: {
    height: verticalScale(62),
  },
  flexRow: {
    flexDirection: "row",
  },
  totalView: {
    flexDirection: "row",
    backgroundColor: colorConstants.toPay,
  },
  totalViewFontSize: {
    fontSize: 30,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
  },
  tenderingTotalViewHeight: {
    height: verticalScale(74),
  },
  cashHeight: {
    height: verticalScale(107),
  },
  itemsRow: {
    flexDirection: "row",
    marginTop: verticalScale(4),
  },
  alertItemsRow: {
    backgroundColor: colorConstants.basketalertPopupHeader,
    justifyContent: "center",
    height: verticalScale(325),
    width: scale(587),
  },
  alertWebItemsRow: {
    backgroundColor: colorConstants.basketalertPopupHeader,
    justifyContent: "center",
    height: verticalScale(350),
    width: "100%",
  },
  itemsQuantityRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colorConstants.iconColors.defaultBlue,
  },
  tableRowContainer: {
    flexDirection: "row",
    backgroundColor: colorConstants.white,
  },
  buttonPressed: {
    backgroundColor: colorConstants.selectedItemBackground,
  },
  NonSelected: {
    backgroundColor: colorConstants.white,
  },

  Selected: {
    backgroundColor: colorConstants.receiptBackgroud,
  },
  tableRow: {
    justifyContent: "center",
  },
  textAlignVerticalCenter: {
    textAlignVertical: "center",
  },
  itemsHeight: {
    flexDirection: "column",
    minHeight: verticalScale(515),
  },
  totalItemRowMarginRight: {
    marginRight: verticalScale(24),
  },
  totalItemColumnMarginRight: {
    marginRight: verticalScale(25),
  },
  deductAmount: {
    marginBottom: verticalScale(10),
    color: colorConstants.deductAmountButton,
  },
  disableDeductAmountTxt: {
    marginBottom: verticalScale(10),
    color: colorConstants.disabledTextColour,
  },
  itemWidth: {
    width: "46%",
  },
  itemHeight: {
    height: verticalScale(68),
  },
  itemQuantityHeight: {
    height: verticalScale(286),
  },
  priceWidth: {
    width: "22%",
    paddingRight: scale(25),
  },
  calcTxtWidth: {
    width: "59%",
    paddingRight: scale(35),
  },
  calcTotalWidth: {
    width: "41%",
  },
  totalWidth: {
    width: "22%",
  },
  totalRowHeight: {
    height: verticalScale(56),
  },
  quantityWidth: {
    width: "10%",
  },

  testtest: {
    textAlign: "right",
  },
  emptyQuantityWidth: {
    width: "10%",
  },
  paddingLeft5: {
    padding: 5,
  },
  textCenter: {
    textAlign: "center",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  txtRight: {
    textAlign: "right",
  },
  totalTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontSize: 34,
  },
  cashTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontSize: 28,
  },
  dueTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontSize: 28,
  },
  selfCenter: {
    alignSelf: "center",
  },
  actionBtnPressed: {
    borderColor: colorConstants.borderColorButton,
  },
  enterButton: {
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  numberView: {
    flexDirection: "row",
    marginLeft: scale(10),
    backgroundColor: colorConstants.homePageRightPaneColor,
  },
  numberBtnZero: {
    width: scale(214),
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
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 25,
  },
  tableText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontStyle: "normal",
    fontSize: 20,
  },

  subTotalTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontStyle: "normal",
    fontSize: 30,
    marginLeft: scale(8),
  },
  subTotalValue: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontStyle: "normal",
    fontSize: 30,
  },

  vatTxt: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontStyle: "normal",
    fontSize: 20,
  },

  vatValue: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_LIGHT,
    fontStyle: "normal",
    fontSize: 20,
  },

  itemMargin: {
    marginLeft: scale(34),
  },
  itemColMargin: {
    marginLeft: scale(24),
  },
  itemColMargin1: {
    marginLeft: scale(14),
  },
  top12Bottom16: {
    marginTop: verticalScale(14),
    marginBottom: verticalScale(13),
  },
  itemBottom: {
    marginBottom: verticalScale(14),
  },
  verticalCenter: {
    textAlignVertical: "center",
    flex: 1,
  },
  quantityButtonRight: {
    marginBottom: 8,
    marginRight: -10,
  },
  quantityButtonLeft: {
    marginBottom: 8,
    marginLeft: -10,
  },
  quantityTextInputDefault: {
    fontSize: 24,
    padding: 8,
    height: 62,
    width: 88,
    textAlign: "center",
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colorConstants.iconColors.defaultBlue,
  },
  quantityTextInputFocused: {
    fontSize: 24,
    padding: 8,
    height: 62,
    width: 88,
    textAlign: "center",
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colorConstants.inputColors.focusColor,
  },
  quantityTextInputError: {
    fontSize: 24,
    padding: 8,
    height: 62,
    width: 88,
    textAlign: "center",
    backgroundColor: colorConstants.inputColors.error.lightBackground,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colorConstants.inputColors.error.main,
  },
  quantityButton: {
    height: 62,
    width: 62,
    borderWidth: 2,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonBorderDisabled: {
    borderColor: colorConstants.primaryBlue20Percent,
  },
  quantityButtonBorderFocused: {
    borderColor: colorConstants.inputColors.focusColor,
  },
  quantityButtonBorderDefault: {
    borderColor: colorConstants.iconColors.defaultBlue,
  },
  quantityButtonTextColorDisabled: {
    color: colorConstants.primaryBlue20Percent,
  },
  quantityButtonTextColorDefault: {
    color: colorConstants.iconColors.defaultBlue,
  },
});

export const OutLineStyle = (): StyleProp<ViewStyle> => {
  return Platform.select({
    web: {
      outline: "none",
    } as StyleProp<ViewStyle>,
  });
};
