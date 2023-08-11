export enum MISC_LOGS_FN {
  remoteConfigService = "RemoteConfigService",
  priceToRender = "priceToRender",
  onIdle = "onIdle",
  onActive = "onActive",
}

export enum MISC_LOGS_MSG {
  isSynced = "isSynced",
  synced = "synced",
  outOfSync = "out of sync",
  clear = "clear",
  sync = "sync",
}

export const MISC_LOGS_VARS = {
  configRecords: (configLength: number, configHash: string) =>
    `${configLength} records / hash: ${configHash}`,
  lastActiveTime: () => "last active time: " + new Date(),
  remainingTime: (lastActive: Date | null) => "remaining time: " + lastActive,
  appActiveLast: (lastActive: Date | null) => "App active: " + lastActive,
};
