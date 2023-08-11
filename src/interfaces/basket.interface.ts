import { EntryResponseFulfilmentType } from "@ct/api/generator";
import { CommitStatus, FulfillmentStatus } from "@ct/common/state/HomeScreen/updateBasket.slice";
import { BasketItemPayload } from "postoffice-commit-and-fulfill";
import { IJourneyData } from "../components/JourneyRenderer";

export type BasketParams = {
  productType: string;
  context: Record<string, unknown>;
};

export type Basket = {
  params?: BasketParams;
};

export type IInternalJourneyData = IJourneyData & {
  transaction: BasketItemPayload;
  basket?: Basket;
};

type BasketItemSource = "nbit" | "local";

export enum EntryType {
  paymentMode = "paymentMode",
}

export interface IbasketItem {
  id: string;
  total: number;
  name?: string;
  type?: EntryType;
  paymentId?: string;
  deductAmount?: boolean;
  item?: any[];
  quantity: number;
  originalQuantity?: number;
  price: number;
  voidable?: boolean;
  entryID?: number; // only for banking
  cardAllowed?: boolean;
  journeyData?: IInternalJourneyData;
  text?: string;
  itemID?: string;
  commitStatus: CommitStatus;
  fulFillmentStatus: FulfillmentStatus;
  stockunitIdentifier?: string;
  source: BasketItemSource;
  doNotShow?: boolean;
  additionalItemsValue: number;
  localUUID?: string;
}

export interface CashTender {
  cashTenderTenderedAmount: number;
  cashTenderReceivedAmount: number;
}

export type PrepareBasketItemData = { basketArray: IbasketItem[] };

export interface SuspendBasket {
  item: IbasketItem[];
  time: number;
  expireAt?: number;
}

export type Tokens = Record<EntryResponseFulfilmentType, Record<string, string>>;
