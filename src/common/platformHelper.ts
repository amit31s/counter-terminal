import { getVarProvider } from "./StorageConfig/storageConfigHelper";

export const STORAGE_ENV_KEY = "STORAGE_ENV";
export const PREVIOUS_ENV_KEY = "PREVIOUS_ENV";

export const getOriginalEnvVars = () => {
  return Object.keys(process.env)
    .filter((item) => item.startsWith("REACT_APP_"))
    .reduce((acc, curr) => ({ ...acc, [curr]: process.env[curr] }), {});
};

// Enables env vars to be modified in More -> System Settings -> Environment Variable Config
export const envProvider = getVarProvider<string>(
  PREVIOUS_ENV_KEY,
  STORAGE_ENV_KEY,
  getOriginalEnvVars(),
);

export const isUsingStorageEnv = envProvider.REACT_APP_USING_STORAGE_ENV === "true";

export const configSelector = (key: string) => {
  return envProvider[`REACT_APP_${key}`] || "";
};
