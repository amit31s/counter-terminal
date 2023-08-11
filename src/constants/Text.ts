export const TEXT = {
  CTTXT0001: "Transaction status",
  CTTXT0002: "Failed to close basket",
  CTTXT0003: "Please contact support",
  CTTXT0004: "Fulfilment pending",
  CTTXT0005: "Item cannot be voided. Please complete the transaction.",
  CTTXT0006: "Basket cannot be voided. Please complete the transaction.",
  CTTXT0007: "Waiting for pin pad",
  CTTXT0008: (time: number, unit: string) =>
    `Please complete the transaction within the next ${time} ${unit} to avoid reprocessing any existing items in the basket.`,
  CTTXT0009: "Your suspended basket is about to expire.",
  CTTXT00010: "Suspend Basket WarningMessages TestId",
  CTTXT00011: "Notification Close Icon TestId",
  CTTXT00012: "Payment Completed by Cash",
  CTTXT00013: "Payment Completed by Card",
  CTTXT00014: "Processing basket",
  CTTXT00015: "Closing basket",
  CTTXT00016: "Failed to process",
  CTTXT00018: "Customer to pay",
  CTTXT00019: "Pay to customer",
  CTTXT00020: "transactionId not received from paymentsBankingClient",
  CTTXT00021: "No match found!",
  CTTXT00022: "Do you want to select from the list of pouches?",
  CTTXT00023: "Duplicate pouch entry",
  CTTXT00024: "Please collect the receipt. Handover the receipt to delivery driver.",
  CTTXT00025: "something went wrong. Try again",
  CTTXT00026:
    "Pouch barcode was not recognised. Do you want to select from the list of prepared pouches?",
  CTTXT00027: (branch: string) => {
    return `Pouch belongs to a different branch ( ${branch} )`;
  },
  CTTXT00028: "You are not allowed to transfer pouch",
  CTTXT00029: "Transaction Declined",
  CTTXT00030: "Pouch barcode was not recognised",
  CTTXT00031: "Complete the transaction before\nlogging out",
  CTTXT00032: "Unable to LogOff",
  CTTXT00033: "You do not have permission to log on in this branch",
  CTTXT00034: (item: string) =>
    `It has not been possible to add the item (${item}) to the basket at this time. You will need to press cancel to void the item from the basket.`,
  CTTXT00035: "Transaction Recovery Status",
  CTTXT00036: "Please confirm that payment has been received from the customer.",
  CTTXT00037: "Please confirm that payment has been made to the customer.",
  CTTXT00038: "Call Branch Centre Support",
  CTTXT00039: "Call Branch Centre Support on 0333 345 5567 to receive barcode.",
  CTTXT00040: "Call Branch Centre Support on 0333 345 5567.",
  CTTXT00041: "Pending",
  CTTXT00042: "Please confirm that the label was printed successfully.",
  CTTXT00043: "Failed",
  CTTXT00044: "Successful",
  CTTXT0045: (message?: string) =>
    `If the label has printed successfully then ${
      message
        ? message.slice(0, 1).toLocaleLowerCase() + message.slice(1)
        : "place item in 1st Class parcel bag"
    } and click ‘Next’.`,
  CTTXT0046: "If the label has not printed successfully then click ‘Re-print label’.",
  CTTXT0047:
    "If the label fails to print after multiple attempts then click ‘Cancel’ to cancel the transaction.",
  CTTXT0048:
    "It has not been possible to print the label. You can try again or cancel. Cancel will end the transaction and you will start again.",
  CTTXT00049: "You cannot add sales items to the basket while a refund is in progress.",
  CTTXT00050: "You cannot process a refund while there are sales items in the basket.",
  CTTXT00051:
    "There seems to be an issue with your network connection. \n Please check and try again.",
  CTTXT00052: "Network error",
  CTTXT0053: "Reprint",
  CTTXT0054: "Continue",
  CTTXT0055: "Finish",
  CTTXT0056: "Dispatch list printed successfully?",
  CTTXT0057: "Please sign and date stamp the receipt before handing to the CViT Officer.",
  CTTXT00058: "Acceptance list printed successfully?",
  CTTXT00059: "Printing...",
  CTTXT00060: "Are you sure you want to cancel the pouch acceptance?",
  CTTXT00061:
    "Please sign and date stamp the receipt before handing to the CviT Officer. \n\nPouch Acceptance Process is now complete, please store pouches in the Safe for the required 30 minutes before validating the content.",
  CTTXT00062: "Print Unsuccessful.",
  CTTXT00063: "Indeterminate",
  CTTXT00064: "Please wait ...",
  CTTXT00065: "Select a cash location",
  CTTXT00066: (cashLocation: string) => `Enter amount you want to transfer to ${cashLocation}`,
  CTTXT00067: "Successfully Transferred",
  CTTXT00068: "Start cash transfer out by selecting a \nlocation from the list on the left",
  CTTXT00069: (count: number) => {
    const isPlural = count > 1;
    return `${count} ${
      isPlural ? "pouches are" : "pouch is"
    } available for dispatch. Please retreive \n ${
      isPlural ? "pouches" : "pouch"
    } from safe and scan to start dispatch.`;
  },
  CTTXT00070: "Scan or enter ACC Card barcode in\n the text box on the right.",
  CTTXT00071: "There are NO pouches available for dispatch.",
  CTTXT00072: (amount: number | string) => `You can not pay more than ${amount} by cheque`,
  CTTXT00073: "Warning",
  CTTXT00074:
    "Suspending a session leaves you liable for the costs of the session until you get a customer payment when you resume. Press Continue to accept this liability or Cancel otherwise.",
  CTTXT00075: "Network Restored",
  CTTXT00076: (shouldLogout: boolean) => {
    return `Your network connection is now restored.${shouldLogout ? " Please login again." : ""}`;
  },
  CTTXT00077:
    "You need to complete basket before adding this item. You cannot add this item to a basket with a card payment in it.",
  CTTXT00078: "Please confirm cash has been taken/given as a part of this transaction.",
  CTTXT00079: "Development is in progress",
  CTTXT00080: "Invalid Amount",
  CTTXT00081: (minValue: string, maxValue: string) =>
    `The amount input is invalid.\n\nValid amount range:\nMin: ${minValue} to Max: ${maxValue}`,
  CTTXT00082: (amount: number | string) => `You can not pay more than ${amount} by IRC`,
  CTTXT00083: (pouchID: string, errorCode: string | undefined) => {
    return `Pouch "${pouchID}" failed with error code "${errorCode}".`;
  },
  CTTXT00084: "Pouch dispatch failed",
  CTTXT00085: "Pouch acceptance failed",
} as const;
