import { AuthProvider, buildConfigurationClient } from "postoffice-product-journey-api-clients";
import { DataRecords } from "postoffice-product-journey-api-clients/dist/configuration-api";
import type { StorageOptions, StorageRecord } from "postoffice-spm-async-storage";
import storageProvider from "postoffice-spm-async-storage";
import { LOGGER_TYPE } from "@pol/frontend-logger-common";
import { logManager } from "@pol/frontend-logger-web";
import { MISC_LOGS_FN, MISC_LOGS_MSG, MISC_LOGS_VARS } from "@ct/common/constants/MiscLogs";

const METADATA_PREFIX = "_meta";
const CONFIG_PREFIX = "_config";

export const remoteConfigService = (root: string, authHeaders: AuthProvider) => {
  const configClient = buildConfigurationClient(root, authHeaders);
  const miscLogger = logManager(LOGGER_TYPE.miscLogger);

  const metadataStorageOptions: StorageOptions = {
    prefix: METADATA_PREFIX,
  };

  const configStorageOptions: StorageOptions = {
    prefix: CONFIG_PREFIX,
  };

  const isSynced = async (): Promise<boolean> => {
    const remote = await configClient.hash();
    const local = (await storageProvider.getRecord(
      "hash",
      metadataStorageOptions,
    )) as unknown as DataRecords;
    const match: boolean = remote === local?.value;

    miscLogger.info({
      service: MISC_LOGS_FN.remoteConfigService,
      methodName: MISC_LOGS_MSG.isSynced,
      status: match ? MISC_LOGS_MSG.synced : MISC_LOGS_MSG.outOfSync,
    });

    return match;
  };

  const clear = async (): Promise<void> => {
    miscLogger.info({
      service: MISC_LOGS_FN.remoteConfigService,
      methodName: MISC_LOGS_MSG.clear,
    });

    const keys = await storageProvider.getKeysByPrefix(CONFIG_PREFIX);

    for (const key of keys) {
      await storageProvider.removeRecord(key);
    }
  };

  const sync = async (): Promise<void> => {
    const config = await configClient.data();

    await storageProvider.setRecord(
      {
        id: "hash",
        value: config.hash,
      },
      metadataStorageOptions,
    );

    miscLogger.info({
      service: MISC_LOGS_FN.remoteConfigService,
      methodName: MISC_LOGS_MSG.sync,
      status: MISC_LOGS_MSG.synced,
      data: MISC_LOGS_VARS.configRecords(config.data.length, config.hash),
    });

    await storageProvider.setRecords(
      config.data as unknown as StorageRecord[],
      configStorageOptions,
    );
  };

  return Object.freeze({ isSynced, sync, clear });
};
