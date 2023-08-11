import { colorConstants } from "@ct/constants";
import { Box, IBoxProps, IInputProps, ITextProps, InputGroup } from "native-base";
import { GlobalRef, withGlobalRef } from "postoffice-global-ref-input";
import { ReactChild, ReactElement, forwardRef, useState } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { StyledInputError } from "./StyledInputError";
import { StyledInputInput } from "./StyledInputInput";
import { StyledInputLabel } from "./StyledInputLabel";

const StyledInputInputGlobalRef = withGlobalRef(StyledInputInput);

export type StyledInputProps = {
  label?: string;
  labelTestId?: string;
  error?: string;
  errorTestId?: string;
  tooltip?: string;
  inputContainerProps?: IBoxProps;
  inputFocusContainerProps?: IBoxProps;
  inputProps: IInputProps & { value: string; onChangeText: (text: string) => void };
  labelContainerProps?: IBoxProps;
  labelProps?: ITextProps;
  icon?: ReactChild;
  onKeypadEnter?: () => void;
  isDisabled?: boolean;
} & IBoxProps;

export const StyledInput = forwardRef<GlobalRef | null, StyledInputProps>(
  (
    {
      label,
      labelTestId,
      error,
      errorTestId,
      tooltip,
      inputContainerProps = {},
      inputFocusContainerProps = {},
      inputProps: { onFocus, onBlur, isDisabled: isInputDisabled, ...inputProps },
      labelContainerProps = {},
      labelProps = {},
      icon,
      onKeypadEnter,
      isDisabled,
      ...otherProps
    }: StyledInputProps,
    ref,
  ): ReactElement => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Box {...otherProps}>
        {typeof label === "string" && label.length > 0 && (
          <StyledInputLabel
            label={label}
            tooltip={tooltip}
            testId={labelTestId}
            containerProps={labelContainerProps}
            labelProps={labelProps}
          />
        )}
        {typeof error === "string" && error.length > 0 && (
          <StyledInputError error={error} testId={errorTestId} />
        )}
        <Box w="400px" h="72px" {...inputContainerProps}>
          <Box
            flex={1}
            borderColor={isFocused ? colorConstants.inputColors.focusBorder : "transparent"}
            borderWidth="2px"
            borderStyle="solid"
            borderRadius="6px"
            margin="-2px"
            {...inputFocusContainerProps}
          >
            <InputGroup
              borderRadius="4px"
              borderWidth={isFocused ? "2px" : "1px"}
              borderStyle="normal"
              borderColor={
                (error?.length ?? 0) > 0
                  ? colorConstants.inputColors.error.main
                  : isDisabled
                  ? colorConstants.inputColors.disabled.main
                  : colorConstants.inputColors.border
              }
              backgroundColor={
                (error?.length ?? 0) > 0
                  ? colorConstants.inputColors.error.background
                  : isDisabled
                  ? colorConstants.inputColors.disabled.background
                  : colorConstants.inputColors.background
              }
              flex={1}
            >
              <StyledInputInputGlobalRef
                InputLeftElement={
                  icon ? <Box ml={isFocused ? "14px" : "15px"}>{icon}</Box> : undefined
                }
                onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  setIsFocused(true);
                  onFocus?.(e);
                }}
                onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                  setIsFocused(false);
                  onBlur?.(e);
                }}
                onKeypadSubmit={() => onKeypadEnter?.()}
                changeSelectionIndex
                isDisabled={isDisabled || isInputDisabled}
                {...inputProps}
                ref={(typeof ref !== "function" && ref) || undefined}
              />
            </InputGroup>
          </Box>
        </Box>
      </Box>
    );
  },
);

StyledInput.displayName = "StyledInput";
