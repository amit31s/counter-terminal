export interface IEnableDisableHomeScreenBtns {
  logOff: boolean;
  lock: boolean;
  branchHub: boolean;
  more: boolean;
}
export interface IPaymentDispatchPayload {
  cashPayment?: number;
  completed: boolean;
  deductAmount?: boolean;
}
export interface ICardPayment {
  cardNo: string;
  amount: number;
  key: string;
}
export interface IPaymentDes {
  cash: number;
  card: ICardPayment[];
}

export interface IHeader {
  branchName: string;
  branchAddress: string;
  vatInfo: string;
  dateOfIssue: string;
  sessionId: string;
}
export interface IItem {
  description: string;
  quantity: number;
  price: number;
  vatRatesSymbol: string;
}
export interface IPaymentDetails {
  tenderDes: IPaymentDes;
  tenderAmount: number;
  cardDetails?: number;
}
export interface IFooter {
  feedbackMessage: string;
  colleagueName: string;
  fadCode: string;
}
export interface IPrintReceiptData {
  header: IHeader;
  items: IItem[];
  totalDue?: number;
  paymentDetails: IPaymentDetails;
  footer: IFooter;
}
