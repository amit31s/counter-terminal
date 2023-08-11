import { stringConstants } from "@ct/constants";
import { IItem, IPaymentDetails, IPrintReceiptData } from "@ct/interfaces/HomeInterface";
import { PrinterLifecycle, printForSimulator } from "./helpers";

// TODO: CT to move this to configuration API, not the place for it.
export const HtmlReceiptTest = async (basketData: IPrintReceiptData) => {
  const outputHtml = `<html><head>
  </head><body>
  <style>
  #inner {
    width: 60%;
    margin: 5 auto;
  }
  #outer {
    width:60%
  }
   .cop-receipt { font-family:"courier new"; font-size: 16px; }
   .cop-receipt .col-1-1 { width:100%; }
   .cop-receipt .col-1-2, .col-2-4, .col-3-6 { width:50%; }
   .cop-receipt .col-1-3, .col-2-6 { width:33.3%; }
   .cop-receipt .col-2-3, .col-4-6 { width:66.6%; }
   .cop-receipt .col-1-4 { width:25%; }
   .cop-receipt .col-3-4 { width:75%; }
   .cop-receipt .col-1-5 { width:20%; }
   .cop-receipt .col-4-5 { width:80%; }
   .cop-receipt .col-1-6 { width:16.7%; }
   .cop-receipt .col-5-6 { width:83.3%; }
   .cop-receipt .col-left { text-align: left; }
   .cop-receipt .col-right { text-align: right; }
   .cop-receipt .bold { font-weight: bold; }
   .cop-receipt .col-centre { text-align: center; }
   .cop-receipt .col-image-centre { text-align: center; margin-bottom: 10px; }
   .cop-receipt.uppercase { text-transform: uppercase; }
</style>
<div id="outer">
  <div id="inner"><img src="data:image/png;base64,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" alt="post office logo"></div>
  <div id="inner">Post Office Ltd.</div>
  <div id="inner">Your Receipt</div>
   <br/>
   <div class="col-left">
      <p>${
        basketData.header.branchName.charAt(0).toUpperCase() + basketData.header.branchName.slice(1)
      }</p>
      <p>${
        basketData.header.branchAddress.charAt(0).toUpperCase() +
        basketData.header.branchAddress.slice(1)
      }</p>
      <p>VAT: ${basketData.header.vatInfo}</p>
      <p>Session ID: ${basketData.header.sessionId}</p>
      <p>${basketData.header.dateOfIssue}</p>
   </div>
   <br>
    ${getReceiptItemsHtml(basketData.items)}
    <br>
    <div>
    ${getpaymentDetails(basketData.paymentDetails)}
    <br/>
    </div>
 
         <p>${basketData.footer.feedbackMessage}</p><br/>
         <p>Colleague name : ${basketData.footer.colleagueName}</p>
      <p>FAD code : ${basketData.footer.fadCode}</p>
      <br/>
     
         <p>Please retain for future reference</p>
        
         <p>Thankyou</p>
  
</div>
    </body></html>`;
  return outputHtml;
};
const getpaymentDetails = (paymentDetails: IPaymentDetails) => {
  let paymentDetailHtml = ``;
  let totalPaid = 0;
  if (paymentDetails.tenderDes.cash > 0) {
    totalPaid = paymentDetails.tenderDes.cash;
  }
  if (paymentDetails.tenderDes.card.length > 0) {
    paymentDetails.tenderDes.card.forEach((item) => {
      totalPaid += item.amount;
    });
  }
  if (paymentDetails.tenderAmount < totalPaid) {
    return ` <p><span class="bold">Post Office to pay</span>: ${stringConstants.Symbols.Pound}  ${
      totalPaid - paymentDetails.tenderAmount
    }</p>
    <br>`;
  }
  paymentDetailHtml =
    paymentDetailHtml +
    `<p>Total Due: ${stringConstants.Symbols.Pound + paymentDetails.tenderAmount}</p>`;
  if (paymentDetails.tenderDes.cash > 0) {
    paymentDetailHtml =
      paymentDetailHtml +
      `<p>Type: <span class="uppercase">Cash</span></p>
      <p>Amount: ${stringConstants.Symbols.Pound + paymentDetails.tenderDes.cash}</p>`;
  }
  if (paymentDetails.tenderDes.card.length > 0) {
    paymentDetails.tenderDes.card.forEach((item) => {
      paymentDetailHtml += `
      <p>Type: <span class="uppercase">Card</span></p>
      <p>Card no. : ${item.cardNo}</p>
      <p>Amount : ${stringConstants.Symbols.Pound + item.amount}</p>
      `;
    });
  }
  return paymentDetailHtml;
};
const getReceiptItemsHtml = (lineItems: IItem[]) => {
  if (lineItems === undefined) return "";
  if (lineItems.length === 0) return "";
  return `<div>${lineItems.map(getLineItemHtml)}</div>`;
};

const getLineItemHtml = (lineItem: IItem) => {
  const lineItemHtml = `
  <table>
      <tr>
          <td class="col-left col-1-5 bold" colspan="5">${lineItem.description}</td>
      </tr>
      <tr>
          <td  class="col-1-5 col-left">${lineItem.quantity}</td>
          <td  class="col-1-5 col-left">x</td>
          <td  class="col-1-5 col-right">${stringConstants.Symbols.Pound + lineItem.price}</td>
      </tr>
      <tr>
      <td class="col-1-5 col-left" >VAT Symbol : ${lineItem.vatRatesSymbol}</td>
    </tr>
      <tr>
          <td class="col-1-5 col-left" >Total : ${lineItem.quantity * lineItem.price}</td>
      </tr>
  </table>`;
  return lineItemHtml;
};

export const createReceipt = async (printReceiptData: Promise<IPrintReceiptData>) => {
  return HtmlReceiptTest(await printReceiptData);
};

export const onPrint = async (data: string) => {
  printForSimulator(data, events);
};

const events: PrinterLifecycle = {
  onInitialize: () => {
    console.log("Printer onInitilize called");
  },
  onTrigger: () => {
    console.log("Printer onTrigger called");
  },
  printingStarted: () => {
    console.log("Printing in progress");
  },
  onComplete: () => {
    console.log("Printer onComplete called");
  },
  onPrinterDiscovered: () => {
    console.log("Printer onPrinteDiscovered called");
  },
  onError: (error: string) => {
    console.log(`Error: ${error}`);
  },
};
