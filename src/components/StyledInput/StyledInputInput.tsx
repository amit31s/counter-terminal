import { touchKeyboardSelector, useAppSelector } from "@ct/common";
import { COLOR_CONSTANTS, colorConstants } from "@ct/constants";
import { merge } from "lodash";
import { IInputProps, Input } from "native-base";
import { GlobalRef } from "postoffice-global-ref-input";
import { forwardRef } from "react";

type StyledInputInputProps = IInputProps & {
  onChangeText: (text: string) => void;
  value: string;
};

export const StyledInputInput = forwardRef<GlobalRef | null, StyledInputInputProps>(
  ({ _input = {}, _focus = {}, _disabled = {}, ...otherProps }, ref) => {
    const { enabled: touchKeyboardEnabled } = useAppSelector(touchKeyboardSelector);

    return (
      <Input
        variant="unstyled"
        ref={(typeof ref !== "function" && ref) || undefined}
        width="100%"
        height="100%"
        padding={0}
        backgroundColor="transparent"
        fontFamily="body"
        fontWeight={400}
        fontStyle="normal"
        fontSize="24px"
        lineHeight="34px"
        color={colorConstants.text.body}
        placeholderTextColor={colorConstants.text.body}
        virtualKeyboardPolicy={touchKeyboardEnabled ? "auto" : "manual"}
        _input={{
          pl: otherProps.InputLeftElement ? "19px" : "15px",
          pr: "15px",
          _focus: {
            pl: otherProps.InputLeftElement ? "19px" : "14px",
            pr: "14px",
          },
        }}
        _disabled={merge(
          {
            color: COLOR_CONSTANTS.inputColors.disabled.main,
            backgroundColor: COLOR_CONSTANTS.inputColors.disabled.background,
          },
          _disabled,
        )}
        {...otherProps}
      />
    );
  },
);

StyledInputInput.displayName = "StyledInputInput";
