/**
 * Generated by orval v6.11.0 🍺
 * Do not edit manually.
 * transactions
 * PO Transactions
 * OpenAPI spec version: 0.3.0
 */

/**
 * used to create basket in post method of basket resource.
 */
export interface NewBasket {
  /** concatenation of FADcode (7 characters), nodeID (between 33 and 64) and basket Sequence Number provided by device */
  basketID: string;
}
