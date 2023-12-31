/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * BBO Pouch Management Api
 * Replaces `pouch-management-api` Pouch Management API defining how to get and modify Pouch data
 * OpenAPI spec version: 0.1.0
 */
import type { Currency } from './currency';
import type { MaterialType } from './materialType';

export interface Item {
  itemValue?: number;
  itemID?: string;
  itemQuantity?: number;
  denomination?: number;
  currency?: Currency;
  materialType?: MaterialType;
}
