/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Transfer Transactions
 * PO Transactions
 * OpenAPI spec version: 0.1.0
 */
import type { TransferCoreTokens } from './transferCoreTokens';
import type { AdditionalItem } from './additionalItem';

export interface TransferCore {
  id: string;
  itemID: string;
  fadCode: string;
  quantity: number | null;
  valueInPence: number | null;
  /** Placeholder for key values field we may require */
  tokens: TransferCoreTokens;
  additionalItems?: AdditionalItem[];
  transactionMode: number;
  /** <credence>Unique identifier to distinguish between all stock units within each branch */
  stockunitIdentifier: string;
  /** <credence>How each transaction is captured at the point of sale
RDS maintained – Values: 
0 = Barcode
1 = Keyboard/Screen (Manual)
2 = Magnetic Card
3 = Smart Card
4 = Fallback to Mag Swipe (Horizon) or Smart Key (PayStation)
5 = Scales
9 = Kiosk (Post & Go Only)
 */
  methodOfDataCapture?: number;
  /** <CFS>Client Reference number (supplied by client).
This will only be used for the actioned Transactions Correction being passed back to POL SAP against the client products.  

Usage to be controlled via reference data */
  clientReference?: string;
  /** <CFS>Transaction Reference 
Pouch Identifier
Transaction Correction Reference
Transaction Acknowledgment Reference
For Transaction Acknowledgements. This field contains the TA Reference Number.
NOTE: Assumed to be in scope for the completion of this document. Later phase design changes may alter this and subject to understanding of E2E process for TC’s and TA’s, may be remove */
  accountReferenceID?: string;
}
