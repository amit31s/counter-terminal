import { Screen } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { EnvironmentVariableConfig } from "@ct/features";

export const EnvironmentVariableConfigScreen = () => {
  return (
    <Screen title={STRING_CONSTANTS.screenNames.EnvironmentVariableConfig}>
      <EnvironmentVariableConfig />
    </Screen>
  );
};
