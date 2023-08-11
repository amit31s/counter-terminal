import { replaceTicketPlaceholders } from "postoffice-peripheral-management-service";

export default {
  // printed when a signature is required for customers card (i.e. swiped)
  cardSignatureRequired: (merchantTicket: string, transactionId: string) => {
    const formattedMerchantTicket = replaceTicketPlaceholders(merchantTicket, transactionId);
    return {
      template: "banking/v2/online-merchant-signature",
      printingMessage: "MSG90072: Please wait, printing",
      optional: false,
      context: {
        textMode: true,
        merchantTicket: formattedMerchantTicket,
        basketId: "",
      },
    };
  },
  SalesReceipt: "counter-terminal/transaction-receipt",
};
