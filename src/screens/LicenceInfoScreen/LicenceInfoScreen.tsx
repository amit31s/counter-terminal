import { Screen } from "@ct/common";
import { STRING_CONSTANTS } from "@ct/constants";
import { ShowLicences } from "@ct/features/ShowLicencesFeature";

const { LicenceInfo } = STRING_CONSTANTS.screenNames;

export const LicenceInfoScreen = () => {
  return (
    <Screen title={LicenceInfo}>
      <ShowLicences />
    </Screen>
  );
};
