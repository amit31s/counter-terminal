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
import type { PouchStatus } from './pouchStatus';
import type { TotalValue } from './totalValue';
import type { UpdatedBy } from './updatedBy';
import type { PouchDetailsItems } from './pouchDetailsItems';

export interface PouchDetails {
  pouchID: PouchID;
  pouchType: PouchType;
  pouchSubType?: PouchSubType;
  suspendCount?: number;
  status: PouchStatus;
  totalValue?: TotalValue;
  updatedBy: UpdatedBy;
  items: PouchDetailsItems;
}
