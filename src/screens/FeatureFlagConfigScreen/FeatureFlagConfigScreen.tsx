import { Screen } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { FeatureFlagConfig } from "@ct/features";

export const FeatureFlagConfigScreen = () => {
  return (
    <Screen title={STRING_CONSTANTS.screenNames.FeatureFlagConfig}>
      <FeatureFlagConfig />
    </Screen>
  );
};
