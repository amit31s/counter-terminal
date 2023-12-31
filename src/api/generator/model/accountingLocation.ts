/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * BBO Accounting Location Api
 * Accounting Location API defining how to get and modify Accounting Locations
 * OpenAPI spec version: 0.1.0
 */
import type { AccountingLocationID } from './accountingLocationID';
import type { AccountingLocationAccountingLocationType } from './accountingLocationAccountingLocationType';
import type { AccountingLocationStatus } from './accountingLocationStatus';
import type { UpdatedBy } from './updatedBy';

export interface AccountingLocation {
  accountingLocationID: AccountingLocationID;
  accountingLocationName: string;
  accountingLocationType: AccountingLocationAccountingLocationType;
  status?: AccountingLocationStatus;
  updatedBy: UpdatedBy;
}
