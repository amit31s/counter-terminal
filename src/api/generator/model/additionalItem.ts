/**
 * Generated by orval v6.11.0 🍺
 * Do not edit manually.
 * transactions
 * PO Transactions
 * OpenAPI spec version: 0.3.0
 */
import type { AdditionalItemTokens } from './additionalItemTokens';

/**
 * Model to capture information of linked items 
 */
export interface AdditionalItem {
  itemID: string;
  itemDescription?: string;
  itemType?: string;
  valueInPence: number;
  /** @deprecated */
  value?: number;
  quantity: number;
  receiptLine?: string;
  /** place holder if any filed required in future, to be used a key/value pair in tokens object if token name is prepended with *, then it will be treated as personal data */
  tokens?: AdditionalItemTokens;
}