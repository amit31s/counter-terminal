import { HorizontalRule, StyledButton } from "@ct/components";
import { AppConstants, SCREENS, stringConstants } from "@ct/constants";
import { Box, Text } from "native-base";
import { StyleSheet } from "react-native";
import { useNavigate } from "react-router-dom";
import { getGitBuildInfo } from "./GitInfo";
import { GitInfoItem } from "./GitInfoitem";
import { useAppSelector } from "@ct/common";

const buttonStyles = StyleSheet.create({
  baseStyle: {
    alignSelf: "flex-start",
    marginVertical: 16,
    marginRight: 16,
  },
  endStyle: {
    alignSelf: "flex-start",
    marginVertical: 16,
  },
});

const gitInfo = [
  {
    label: stringConstants.GitInfoScreen.commit,
    value: getGitBuildInfo().commit,
  },
  {
    label: stringConstants.GitInfoScreen.branch,
    value: getGitBuildInfo().branch,
  },
  {
    label: stringConstants.GitInfoScreen.tag,
    value: getGitBuildInfo().tag,
  },
];

export const GitInfoFeature = () => {
  const navigate = useNavigate();
  const { user, device } = useAppSelector((rootState) => rootState.auth);
  const userRole = user?.roles?.find((role) => role.fadCode === device.branchID);
  const canAccessConfig = userRole && AppConstants.Roles.AccessConfig.includes(userRole.role);

  return (
    <Box mt="1%" flex={1} testID="test_GitInfoFeature">
      <Box ml="45px" mr="45px" px="12px" borderWidth={0} shadow={"0"} flex={1}>
        <Box display="flex" flexDirection="row">
          <StyledButton
            onPress={() => navigate(SCREENS.LICENCE_INFO)}
            size={"slim"}
            label={stringConstants.GitInfoScreen.checkLicences}
            type="tertiary"
            testID={stringConstants.GitInfoScreen.checkLicences}
            styles={buttonStyles.baseStyle}
          />

          <StyledButton
            onPress={() => navigate(SCREENS.ENVIRONMENT_VARIABLE_CONFIG)}
            size={"slim"}
            label={stringConstants.GitInfoScreen.environmentVariableConfig}
            type="tertiary"
            testID={stringConstants.GitInfoScreen.environmentVariableConfig}
            styles={buttonStyles.baseStyle}
            isDisabled={!canAccessConfig}
          />

          <StyledButton
            onPress={() => navigate(SCREENS.FEATURE_FLAG_CONFIG)}
            size={"slim"}
            label={stringConstants.GitInfoScreen.featureFlagConfig}
            type="tertiary"
            testID={stringConstants.GitInfoScreen.featureFlagConfig}
            styles={buttonStyles.endStyle}
            isDisabled={!canAccessConfig}
          />
        </Box>

        <Text pt="12px" fontSize={28}>
          {stringConstants.GitInfoScreen.versionInfo}
        </Text>

        <HorizontalRule />

        {gitInfo.map((item) => (
          <GitInfoItem key={item.label} label={item.label} value={item.value} />
        ))}
      </Box>
    </Box>
  );
};
