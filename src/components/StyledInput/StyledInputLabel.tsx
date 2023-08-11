import { COLOR_CONSTANTS } from "@ct/constants";
import { Box, IBoxProps, ITextProps, Text } from "native-base";
import { ReactElement } from "react";
import { StyledInputLabelTooltip } from "./StyledInputLabelTooltip";

type StyledInputLabelProps = {
  label: string;
  tooltip?: string;
  testId?: string;
  containerProps: IBoxProps;
  labelProps?: ITextProps;
};

export const StyledInputLabel = ({
  label,
  tooltip,
  testId,
  containerProps = {},
  labelProps = {},
}: StyledInputLabelProps): ReactElement => {
  return (
    <Box
      h="40px"
      mb="10px"
      justifyContent="center"
      testID={testId}
      flexDir="row"
      {...containerProps}
    >
      <Text
        fontFamily="body"
        fontWeight={700}
        fontSize="24px"
        lineHeight="34px"
        flex={1}
        color={containerProps?.color ?? COLOR_CONSTANTS.inputColors.label}
        {...labelProps}
      >
        {label}
      </Text>
      {typeof tooltip === "string" && tooltip.length > 0 && (
        <StyledInputLabelTooltip
          tooltip={tooltip}
          color={containerProps?.color?.toString() ?? COLOR_CONSTANTS.inputColors.label}
        />
      )}
    </Box>
  );
};
