import { envProvider, getOriginalEnvVars, STORAGE_ENV_KEY } from "@ct/common/platformHelper";
import { StorageConfig } from "@ct/common/StorageConfig";
import { stringConstants } from "@ct/constants";

export const EnvironmentVariableConfig = () => {
  return (
    <StorageConfig
      activeConfig={envProvider}
      storageKey={STORAGE_ENV_KEY}
      getOriginalConfig={getOriginalEnvVars}
      description={stringConstants.EnvironmentVariableConfigScreen.description}
      shouldStringifyValues={true}
    />
  );
};
