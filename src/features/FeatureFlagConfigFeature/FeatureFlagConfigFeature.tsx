import { StorageConfig } from "@ct/common/StorageConfig";
import {
  featureFlags,
  getOriginalFeatureFlags,
  STORAGE_FEATURE_FLAG_KEY,
  stringConstants,
} from "@ct/constants";

export const FeatureFlagConfig = () => {
  return (
    <StorageConfig
      activeConfig={featureFlags}
      storageKey={STORAGE_FEATURE_FLAG_KEY}
      getOriginalConfig={getOriginalFeatureFlags}
      description={stringConstants.FeatureFlagConfigScreen.description}
      shouldStringifyValues={false}
    />
  );
};
