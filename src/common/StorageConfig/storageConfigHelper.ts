import { isEqual } from "lodash";

export const getStorageVars = (storageKey: string) => {
  const existingStorageString = localStorage.getItem(storageKey);
  const existingStorage: Record<string, string> | null = existingStorageString
    ? JSON.parse(existingStorageString)
    : null;

  return existingStorage;
};

export const configureStorageVars = <T>(
  previousKey: string,
  storageKey: string,
  originalVars: Record<string, T>,
) => {
  const previousVars = getStorageVars(previousKey);

  if (isEqual(originalVars, previousVars)) {
    // Vars haven't been changed externally so we're safe to early return
    return;
  }
  // If vars have been changed externally then reset our
  // stored vars
  localStorage.setItem(storageKey, JSON.stringify(originalVars));
  localStorage.setItem(previousKey, JSON.stringify(originalVars));
};

export const getVarProvider = <T>(
  previousKey: string,
  storageKey: string,
  originalVars: Record<string, T>,
) => {
  configureStorageVars(previousKey, storageKey, originalVars);

  const storageVarString = localStorage.getItem(storageKey);
  if (!storageVarString) {
    console.error("STORAGE: CAN'T FIND VARS");
    return {};
  }
  const storageVar: Record<string, T> = JSON.parse(storageVarString);
  return storageVar;
};

export const stringifyValues = (obj: Record<string, unknown>) =>
  Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: `${obj[key]}` }), {});
