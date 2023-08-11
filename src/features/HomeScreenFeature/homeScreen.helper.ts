import { CommitStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { SalesItem, SalesReceiptData } from "@ct/common/state/updateSalesReceipt.slice";
import { STATE_CONSTANTS, TEXT } from "@ct/constants";
import { IbasketItem } from "@ct/interfaces/basket.interface";
import { DeviceAttributes } from "@ct/interfaces/device.interface";
import { floatConversion } from "@ct/utils";
import { produce } from "immer";

import { cashItemID, getProductByProdNo, ircItemID } from "@ct/common";
import { cloneDeep } from "lodash";
import {
  AdditionalItem,
  CommitAndFulfillPointEnum,
  PEDFulfillerActions,
} from "postoffice-commit-and-fulfill";
import { MAILSFulfillerActions } from "../../features/HomeScreenFeature/homeScreen.enum";
interface ItemCommitStatus {
  items: IbasketItem[];
  count: number;
}
type InitialPrintData = {
  basketItems: IbasketItem[];
  device: DeviceAttributes;
  paidByCard: number;
  paidByCash: number;
  remainingBalance: number;
  postOfficeToPay: number;
  customerToPay: number;
  receiptData: SalesReceiptData;
  basketId: string;
};

type GetAggregatedItems = {
  count: number;
  items: IbasketItem[];
};

export const basketcommitted = (basketData: IbasketItem[]) => {
  const status: CommitStatus[] = [CommitStatus.success, CommitStatus.fail];
  const filteredItems = basketData.filter((item: IbasketItem) =>
    status.includes(item.commitStatus),
  );
  return filteredItems.length === basketData.length;
};

export const isCommitPending = (basketItems: IbasketItem[]) => {
  return basketItems.find(
    (item) =>
      item.commitStatus === STATE_CONSTANTS.FAIL ||
      item.commitStatus === STATE_CONSTANTS.NOTINITIATED,
  );
};
export const isAggregatedCommitPending = (basketItems: IbasketItem[]) => {
  return basketItems.find(
    (item) =>
      item.journeyData?.transaction?.commitAndFulfillPoint ===
        CommitAndFulfillPointEnum.Aggregated &&
      (item.commitStatus === STATE_CONSTANTS.NOTINITIATED ||
        item.commitStatus === STATE_CONSTANTS.FAIL),
  );
};

export const getNotInitiatedItems = (basketData: IbasketItem[]): ItemCommitStatus => {
  const items = basketData.filter((item) => item.commitStatus === "notInitiated");
  return { items, count: items.length };
};

export const getFailedItems = (basketData: IbasketItem[]): ItemCommitStatus => {
  const items = basketData.filter((item) => item.commitStatus === "fail");
  return { items, count: items.length };
};

export const getCommitedItems = (basketData: IbasketItem[]): ItemCommitStatus => {
  const items = basketData.filter((item) => item.commitStatus === "success");
  return { items, count: items.length };
};

export const receiptDateAndTime = () => {
  let date_time = "";
  const currentDateAndTime = new Date();
  if (currentDateAndTime.getDate().toString().length === 1) {
    date_time = "0" + currentDateAndTime.getDate().toString() + "/";
  } else {
    date_time = currentDateAndTime.getDate().toString() + "/";
  }
  if ((currentDateAndTime.getMonth() + 1).toString().length === 1) {
    date_time = date_time + "0" + (currentDateAndTime.getMonth() + 1).toString() + "/";
  } else {
    date_time = date_time + (currentDateAndTime.getMonth() + 1).toString() + "/";
  }
  date_time =
    date_time +
    currentDateAndTime.getFullYear().toString() +
    " " +
    currentDateAndTime.getHours().toString() +
    ":" +
    (currentDateAndTime.getMinutes().toString().length === 1
      ? "0" + currentDateAndTime.getMinutes().toString()
      : currentDateAndTime.getMinutes().toString());
  return date_time;
};

export const alignSalesPrintData = (initialPrintData: InitialPrintData): SalesReceiptData => {
  const salesReceiptData: SalesReceiptData = Object.assign({}, initialPrintData.receiptData);
  salesReceiptData.DateOfIssue = receiptDateAndTime() || "";
  salesReceiptData.empName = "TBC";
  salesReceiptData.vatRegNo = "TBC";
  if (initialPrintData.device.branchID) {
    salesReceiptData.fadCode = initialPrintData.device.branchID.slice(0, 6);
  }
  if (initialPrintData.basketId) {
    salesReceiptData.sessionId =
      initialPrintData.basketId.slice(0, 6) + initialPrintData.basketId.slice(7);
  }
  if (initialPrintData.device.branchAddress) {
    salesReceiptData.branchAddress = initialPrintData.device.branchAddress;
  }
  if (initialPrintData.remainingBalance < 0) {
    salesReceiptData.balance = floatConversion(-initialPrintData.remainingBalance);
  } else {
    salesReceiptData.balance = "0.00";
  }
  if (initialPrintData.customerToPay) {
    salesReceiptData.customerToPay = initialPrintData.customerToPay.toString();
  }
  if (initialPrintData.postOfficeToPay) {
    salesReceiptData.postOfficeToPay = initialPrintData.postOfficeToPay.toString();
  }
  if (initialPrintData.paidByCard) {
    salesReceiptData.isCardReceipt = true;
    salesReceiptData.isSuccessReceipt = true;
    salesReceiptData.isFailureReceipt = false;
    salesReceiptData.amountPaidByCard = floatConversion(initialPrintData.paidByCard);
  }
  if (initialPrintData.paidByCash) {
    salesReceiptData.isSuccessReceipt = true;
    salesReceiptData.isCardReceipt = false;
    salesReceiptData.isFailureReceipt = false;
    salesReceiptData.amountPaidByCash = floatConversion(initialPrintData.paidByCash);
  }
  if (initialPrintData.paidByCard && initialPrintData.paidByCash) {
    salesReceiptData.isCardReceipt = true;
    salesReceiptData.isSuccessReceipt = true;
    salesReceiptData.isFailureReceipt = false;
  }
  if (initialPrintData.basketItems) {
    const itemsData: SalesItem[] = salesReceiptData.items
      ? Object.assign([], salesReceiptData.items)
      : [];
    initialPrintData.basketItems.forEach((item) => {
      if (item.item) {
        itemsData.push({
          itemTitle: item.item?.toString() || "",
          qty: item.quantity || 0,
          price: floatConversion(item.price || 0),
          total: floatConversion(item.total || 0),
        });
      }
    });
    salesReceiptData.items = itemsData;
  }
  return salesReceiptData;
};
export const printFailureCardReceipt = (
  cardDetails: string,
  basketId: string,
  device: DeviceAttributes,
): SalesReceiptData => {
  const failureReceiptData: SalesReceiptData = {};
  failureReceiptData.DateOfIssue = receiptDateAndTime();
  if (basketId) {
    failureReceiptData.sessionId = basketId;
  }
  if (device.branchID) {
    failureReceiptData.fadCode = device.branchID.slice(0, 6);
  }
  if (device.branchAddress) {
    failureReceiptData.branchAddress = device.branchAddress;
  }
  failureReceiptData.empName = "TBC";
  failureReceiptData.vatRegNo = "TBC";
  failureReceiptData.cardDetails?.push(cardDetails);
  failureReceiptData.isSuccessReceipt = false;
  failureReceiptData.isCardReceipt = true;
  failureReceiptData.isFailureReceipt = true;
  return failureReceiptData;
};

export const syncSelectedItem = (
  selectedItemId: string | undefined,
  allItems: IbasketItem[],
): IbasketItem | undefined => {
  if (!selectedItemId) {
    return undefined;
  }
  return allItems.filter((item) => item.id === selectedItemId)[0];
};

export const isCommitInitiated = (item: IbasketItem | IbasketItem[]): boolean => {
  if (Array.isArray(item)) {
    const filteredItems = item.filter(
      (itemObj) => itemObj.commitStatus === STATE_CONSTANTS.COMMIT_INITIATED,
    );
    return filteredItems.length !== 0;
  }
  return item.commitStatus === STATE_CONSTANTS.COMMIT_INITIATED;
};

export const allItemsCommited = (basketItems: IbasketItem[]): boolean => {
  return basketItems.every(({ commitStatus }) => commitStatus === STATE_CONSTANTS.SUCCESS);
};

export const getAggregatedItems = (basketItems: IbasketItem[]): GetAggregatedItems => {
  const items = basketItems.filter(
    (item) =>
      item.journeyData?.transaction?.commitAndFulfillPoint === CommitAndFulfillPointEnum.Aggregated,
  );

  return {
    count: items.length,
    items: cloneDeep(items),
  };
};

export type VatCodeRateString = "" | "S" | "R" | "Z" | "E";
export interface IReceiptBasketItem extends IbasketItem {
  vatCode: VatCodeRateString;
  exVatPrice: number;
  incVatPrice: number;
  incVatTotal: number;
}

/**
 * Generates the context needed to print the horizon sales receipt.
 * @param basketItems current items in the basket
 */
export const generateSalesReceiptContext = async (
  device: DeviceAttributes,
  basketId: string,
  basketItems: IbasketItem[],
  dueToPostOffice: number,
  dueToCustomer: number,
  balance: number,
  customerTickets: string[],
) => {
  type VatCode = "" | "A" | "B" | "C" | "D";
  const vatCodeToRateString: Record<VatCode, VatCodeRateString> = {
    "": "",
    A: "S",
    B: "R",
    C: "Z",
    D: "E",
  } as const;

  const getItemVatCode = async (item: IbasketItem): Promise<VatCode> => {
    const ProdNo: string | undefined | null = item.itemID ?? item.journeyData?.transaction?.itemID;
    if (item.type === "paymentMode" || !ProdNo) {
      return "";
    }
    try {
      const product = await getProductByProdNo(ProdNo);
      return typeof product.vatCode === "string" &&
        ["", "A", "B", "C", "D"].includes(product.vatCode)
        ? (product.vatCode as VatCode)
        : "";
    } catch (_) {
      return "";
    }
  };

  interface IBasketItemWithVatCode extends IbasketItem {
    vatCode: VatCode;
  }

  type SortedItems = {
    paymentItems: IReceiptBasketItem[];
    ratedItems: IReceiptBasketItem[];
    exemptItems: IReceiptBasketItem[];
    nonRatedItems: IReceiptBasketItem[];
  };

  const filterItem = (items: SortedItems, item: IReceiptBasketItem): SortedItems =>
    produce(items, (draftItems) => {
      if (item.type === "paymentMode") {
        if (item.total !== 0) {
          draftItems.paymentItems.push(item);
        }
        return;
      }

      switch (item.vatCode) {
        case "":
          draftItems.nonRatedItems.push(item);
          break;
        case "S":
        case "R":
        case "Z":
          draftItems.ratedItems.push(item);
          break;
        case "E":
          draftItems.exemptItems.push(item);
          break;
      }
    });
  const withVatCodes: IBasketItemWithVatCode[] = await Promise.all(
    basketItems.map<Promise<IBasketItemWithVatCode>>(async (item) => {
      return {
        ...item,
        vatCode: await getItemVatCode(item),
      };
    }),
  );
  const withVatCodeRateStrings: IReceiptBasketItem[] = withVatCodes.map((item) => {
    const vatCode = vatCodeToRateString[item.vatCode];

    let additionalItemsTotal = 0;
    for (const additionalItem of item.journeyData?.transaction?.additionalItems ?? []) {
      additionalItemsTotal += Number(additionalItem.valueInPence);
    }

    const incVatTotal =
      (item.journeyData?.transaction?.valueInPence ?? null) !== null
        ? Number(item.journeyData.transaction.valueInPence) + additionalItemsTotal
        : Number(item.total) * 100 + additionalItemsTotal;
    const incVatPrice =
      (item.journeyData?.transaction?.valueInPence ?? null) !== null
        ? (Number(item.journeyData.transaction.valueInPence) + additionalItemsTotal) /
          Number(item.quantity ? item.quantity : 1)
        : Math.round(Number(item.price) * 100) + additionalItemsTotal;
    const vatRate = vatCode === "S" ? 1.2 : vatCode === "R" ? 1.05 : 1;
    const exVatPriceUnrounded = incVatPrice / vatRate;
    const exVatPrice =
      exVatPriceUnrounded % 1 > 0.5
        ? Math.ceil(exVatPriceUnrounded)
        : Math.floor(exVatPriceUnrounded);
    return {
      ...item,
      vatCode,
      incVatTotal,
      incVatPrice,
      exVatPrice,
    };
  });
  const separatedItems = withVatCodeRateStrings.reduce(filterItem, {
    paymentItems: [],
    ratedItems: [],
    exemptItems: [],
    nonRatedItems: [],
  });

  const vatSubtotals = separatedItems.ratedItems.reduce(
    (acc, val) =>
      produce(acc, (draft) => {
        switch (val.vatCode) {
          case "Z":
          case "R":
          case "S":
            const net = val.exVatPrice * (val.quantity ?? 1);
            const vat = (val.incVatPrice - val.exVatPrice) * (val.quantity ?? 1);
            const total = val.incVatTotal;
            draft[val.vatCode].net += net;
            draft[val.vatCode].vat += vat;
            draft[val.vatCode].total += total;
            draft.subtotal.net += net;
            draft.subtotal.vat += vat;
            draft.subtotal.total += total;
        }
      }),
    {
      Z: {
        net: 0,
        vat: 0,
        total: 0,
      },
      R: {
        net: 0,
        vat: 0,
        total: 0,
      },
      S: {
        net: 0,
        vat: 0,
        total: 0,
      },
      subtotal: {
        net: 0,
        vat: 0,
        total: 0,
      },
    },
  );

  const hasStandardVatItems = separatedItems.ratedItems.some(({ vatCode }) => vatCode === "S");
  const hasReducedVatItems = separatedItems.ratedItems.some(({ vatCode }) => vatCode === "R");
  const hasZeroVatItems = separatedItems.ratedItems.some(({ vatCode }) => vatCode === "Z");
  const hasExemptVatItems = separatedItems.exemptItems.length > 0;
  const bareVatRates = [];
  if (hasStandardVatItems) {
    bareVatRates.push("(S)=Standard Rate");
  }
  if (hasReducedVatItems) {
    bareVatRates.push("(R)=Reduced Rate");
  }
  if (hasZeroVatItems) {
    bareVatRates.push("(Z)=Zero Rate");
  }
  if (hasExemptVatItems) {
    bareVatRates.push("(E)=Exempt");
  }
  const vatRates =
    bareVatRates.length <= 2 || !hasStandardVatItems
      ? bareVatRates.join(" ")
      : bareVatRates.slice(0, 2).join(" ") + "\n" + bareVatRates.slice(2).join(" ");

  return {
    textMode: true,
    fad: device.branchID.slice(0, 6),
    branchAddress: [device.branchName, device.branchAddress, device.branchPostcode]
      .filter((str) => str.length > 0)
      .join(", "),
    vatRegNo: "GB 243 1700 02",
    dateOfIssue: new Date().getTime() / 1000,
    session: basketId.slice(0, 6) + basketId.slice(7),
    hasVatItems: separatedItems.ratedItems.length > 0 || separatedItems.exemptItems.length > 0,
    hasNonExemptVatItems: separatedItems.ratedItems.length > 0,
    hasStandardVatItems,
    hasReducedVatItems,
    hasZeroVatItems,
    nonExemptVatItems: separatedItems.ratedItems,
    vatSubtotals,
    hasExemptVatItems,
    exemptVatItems: separatedItems.exemptItems,
    vatRates,
    hasNonRatedItems: separatedItems.nonRatedItems.length > 0,
    nonRatedItems: separatedItems.nonRatedItems,
    dueToPostOffice,
    dueToCustomer,
    balance,
    paymentItems: separatedItems.paymentItems,
    customerTickets,
  };
};

export const getTransactionStatusText = (fulFillmentStatus: string): string => {
  const {
    SUCCESS,
    FULFILLMENT_NOT_REQUIRED,
    FULFILLMENT_FAILED,
    FULFILLMENT_PENDING,
    FULFILLMENT_INDETERMINATE,
  } = STATE_CONSTANTS;
  switch (fulFillmentStatus) {
    case SUCCESS:
    case FULFILLMENT_NOT_REQUIRED:
      return TEXT.CTTXT00044;
    case FULFILLMENT_FAILED:
    case FULFILLMENT_PENDING:
    case FULFILLMENT_INDETERMINATE:
      return TEXT.CTTXT00043;
    default:
      return TEXT.CTTXT00043;
  }
};

export const getItemTotal = (item: IbasketItem): number => {
  const { price, additionalItemsValue, quantity } = item;
  return price * Math.abs(quantity) + additionalItemsValue;
};

export const decideMessage = (nbitBasketItems: IbasketItem[]): string => {
  const { fulFillmentStatus } = nbitBasketItems[0];
  const fulfilmentAction = nbitBasketItems[0]?.journeyData?.transaction?.tokens?.fulfilmentAction;
  const itemID = nbitBasketItems[0]?.journeyData?.transaction?.itemID;
  const additionalItems: AdditionalItem[] =
    nbitBasketItems[0]?.journeyData?.transaction?.additionalItems || [];
  const initialPrice: number =
    nbitBasketItems[0]?.journeyData?.transaction?.valueInPence ?? nbitBasketItems[0]?.price * 100;

  const price = additionalItems.reduce((acc: number, item: AdditionalItem) => {
    const { valueInPence } = item;
    return acc + valueInPence;
  }, initialPrice);

  if (getTransactionStatusText(fulFillmentStatus) === TEXT.CTTXT00043) {
    return "";
  }
  if (itemID === cashItemID) {
    if (price > 0) {
      return TEXT.CTTXT00037;
    } else {
      return TEXT.CTTXT00036;
    }
  }
  if (
    fulfilmentAction === PEDFulfillerActions.Debit ||
    fulfilmentAction === PEDFulfillerActions.CashDeposit
  ) {
    return TEXT.CTTXT00036;
  }
  if (fulfilmentAction === PEDFulfillerActions.CashWithdrawal) {
    return TEXT.CTTXT00037;
  }
  if (fulfilmentAction === MAILSFulfillerActions.Label) {
    return TEXT.CTTXT00042;
  }
  return "";
};

export const chequeUUID = (chequeObject: IbasketItem): string => {
  return STATE_CONSTANTS.CHEQUE + chequeObject.localUUID;
};

export function ircUUID(ircObject: IbasketItem): string {
  return ircItemID + ircObject.localUUID;
}
