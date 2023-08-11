import { colorConstants, Styles } from "@ct/constants";
import FontFamily from "@ct/utils/Scaling/FontFamily";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tableHeader: {
    height: 62,
    width: 568,
    flexDirection: "row",
    backgroundColor: colorConstants.basketHeaderBg,
    alignItems: "center",
  },
  itemName: {
    flex: 1,
  },
  price: {
    width: Styles.basketSmallGrid,
    marginLeft: Styles.basketHeaderTitleTextPadding,
    textAlign: "center",
  },
  quantity: {
    width: Styles.basketSmallGrid,
    marginLeft: Styles.basketHeaderTitleTextPadding,
    textAlign: "center",
  },
  total: {
    width: Styles.basketSmallGrid,
    marginLeft: Styles.basketHeaderTitleTextPadding,
    textAlign: "center",
  },
  itemTotal: {
    width: Styles.basketSmallGrid,
    marginLeft: Styles.basketHeaderTitleTextPadding,
    textAlign: "right",
  },
  tableHeaderText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 16,
  },
  itemWrapper: {
    height: 74,
    borderBottomColor: colorConstants.basketHeader,
    borderBottomWidth: 2,
    borderStyle: "solid",
  },
  itemsRow: {
    flexDirection: "row",
    height: 72,
    alignItems: "center",
  },
  selected: {
    backgroundColor: colorConstants.yellowSelectedItemBackground,
  },
  notSelected: {
    backgroundColor: colorConstants.white,
  },
  tableText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_REGULAR,
    fontStyle: "normal",
    fontSize: 18,
    marginHorizontal: 16,
  },
  totalItemText: {
    color: colorConstants.black,
    fontFamily: FontFamily.FONT_NUNITO_SEMI_BOLD,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 16,
  },
  toPay: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  customerToPayHeader: {
    width: Styles.basketHeaderWidth,
    height: Styles.basketPaymentLabel,
    flexDirection: "row",
    backgroundColor: colorConstants.iconColors.errorRed,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  payToCustomerHeader: {
    width: Styles.basketHeaderWidth,
    height: Styles.basketPaymentLabel,
    flexDirection: "row",
    backgroundColor: colorConstants.basketLabelPTCBackgroundColor,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  customerToPayText: {
    color: colorConstants.white,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontWeight: "bold",
    fontSize: 30,
    paddingRight: 5,
  },
  payToCustomerText: {
    color: colorConstants.text.title,
    fontFamily: FontFamily.FONT_NUNITO_BOLD,
    fontWeight: "bold",
    fontSize: 30,
    paddingRight: 5,
  },
  toPayTotal: {
    flex: 1,
    textAlign: "right",
  },
});
