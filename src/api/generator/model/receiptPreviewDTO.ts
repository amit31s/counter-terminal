/**
 * Generated by orval v6.7.1 🍺
 * Do not edit manually.
 * transactions
 * PO Transactions

PO Counter Terminal

PO Counter Terminal

PO Counter Terminal

PO Branch Management
 * OpenAPI spec version: 0.1.0
 */
import type { ItemDTO } from './itemDTO';

/**
 * Receipt Preview Data
 */
export interface ReceiptPreviewDTO {
  sub_total?: number;
  total?: number;
  vat?: number;
  items?: ItemDTO[];
}
