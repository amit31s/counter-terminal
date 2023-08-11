import { Screen } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { GitInfoFeature } from "@ct/features/GitInfoFeature";

const { SystemInfo } = STRING_CONSTANTS.screenNames;

export const SystemInfoScreen = () => {
  return (
    <Screen title={SystemInfo}>
      <GitInfoFeature />
    </Screen>
  );
};
