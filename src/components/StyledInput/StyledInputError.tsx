import { COLOR_CONSTANTS } from "@ct/constants";
import { Box, Text } from "native-base";
import { ReactElement } from "react";

type StyledInputErrorProps = {
  error: string;
  testId?: string;
};

export const StyledInputError = ({ error, testId }: StyledInputErrorProps): ReactElement => {
  return (
    <Box marginBottom="8px" testID={testId}>
      <Text
        color={COLOR_CONSTANTS.inputColors.error.main}
        fontFamily="body"
        fontWeight={400}
        fontSize="24px"
        lineHeight="34px"
      >
        {error}
      </Text>
    </Box>
  );
};
