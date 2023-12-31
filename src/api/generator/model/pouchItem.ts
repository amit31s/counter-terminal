/**
 * Generated by orval v6.13.1 🍺
 * Do not edit manually.
 * BBO Pouch Management Api
 * Replaces `pouch-management-api` Pouch Management API defining how to get and modify Pouch data
 * OpenAPI spec version: 0.1.0
 */
import type { PouchID } from './pouchID';
import type { PouchType } from './pouchType';
import type { PouchSubType } from './pouchSubType';
import type { TotalValue } from './totalValue';
import type { PouchStatus } from './pouchStatus';
import type { UpdatedBy } from './updatedBy';

export interface PouchItem {
  pouchID: PouchID;
  pouchType: PouchType;
  pouchSubType?: PouchSubType;
  totalValue?: TotalValue;
  status: PouchStatus;
  updatedBy: UpdatedBy;
  /** timestamp in seconds */
  timestamp?: number;
  /** versionID for pouch will be generated by concatenating HK and SK */
  versionID?: string;
}
