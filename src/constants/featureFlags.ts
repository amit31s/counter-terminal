import { getVarProvider } from "@ct/common/StorageConfig/storageConfigHelper";

export const STORAGE_FEATURE_FLAG_KEY = "STORAGE_FEATURE_FLAG";
export const PREVIOUS_FEATURE_FLAG_KEY = "PREVIOUS_FEATURE_FLAG";

// Set feature flags here
const _featureFlags = {
  shouldSignOutOnAppLaunch: true,
  selfRegisterButtons: false,
  shouldUseFederatedSignIn: true,
  shouldUseSerialNumber: true,
  useLocalFederationManager: false,
} as const;

// Enables feature flags to be modified in More -> System Settings -> Feature Flag Config
export const featureFlags = getVarProvider(
  PREVIOUS_FEATURE_FLAG_KEY,
  STORAGE_FEATURE_FLAG_KEY,
  _featureFlags,
);

export const getOriginalFeatureFlags = () => _featureFlags;
