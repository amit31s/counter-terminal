import { MaterialSymbol } from "@ct/assets/icons";
import { useScanner } from "@ct/common/hooks";
import { StyledButton, StyledInput } from "@ct/components";
import { colorConstants, stringConstants } from "@ct/constants";
import { Box, IInputProps } from "native-base";
import { RefObject, useCallback, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

const buttonStyle = StyleSheet.create({
  buttonStyle: {
    width: "20%",
    marginTop: "20px",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

type ScannerInputProps = IInputProps & {
  showIcon?: boolean;
  placeholder?: string;
  clearErrors?: () => void;
  onSubmitBarcode: (text: string, wasKeyed: boolean) => Promise<void> | void;
  scannerInputRef?: RefObject<TextInput>;
  hideEnterButton?: boolean;
  error?: string;
  forbiddenCharacterRegex?: RegExp;
};

export const ScannerInput = ({
  showIcon = false,
  forbiddenCharacterRegex,
  placeholder,
  clearErrors,
  onSubmitBarcode,
  scannerInputRef,
  hideEnterButton,
  error,
  ...props
}: ScannerInputProps) => {
  const [value, setValue] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useScanner(
    useCallback(
      async (text: string) => {
        setValue(text.trim());
        setSubmitting(true);
        await onSubmitBarcode(text.trim(), false);
        setValue("");
        setSubmitting(false);
      },
      [onSubmitBarcode],
    ),
  );

  useEffect(() => {
    if (!error || !clearErrors) {
      return;
    }
    const clearErrorTimmer = setTimeout(() => {
      clearErrors();
    }, 3000);
    return () => clearTimeout(clearErrorTimmer);
  }, [clearErrors, error]);

  return (
    <Box alignSelf="stretch" flexDir="column">
      <StyledInput
        flex={1}
        error={error}
        isDisabled={props.isDisabled || submitting}
        icon={
          showIcon ? (
            <MaterialSymbol
              name="qr_code_scanner"
              size="medium"
              color={
                props.isDisabled ? colorConstants.buttonColors.disabled.blue : colorConstants.blue
              }
            />
          ) : undefined
        }
        inputContainerProps={{ w: "100%" }}
        onKeypadEnter={async () => {
          setSubmitting(true);
          await onSubmitBarcode(value.trim(), true);
          setValue("");
          setSubmitting(false);
        }}
        inputProps={{
          placeholder: placeholder || stringConstants.Input.barcodeScanner,
          testID: "barcode",
          autoFocus: true,
          blurOnSubmit: false,
          value,
          onChangeText: (text) => {
            setValue(forbiddenCharacterRegex ? text.replace(forbiddenCharacterRegex, "") : text);
          },
          onSubmitEditing: async () => {
            setSubmitting(true);
            await onSubmitBarcode(value.trim(), true);
            setValue("");
            setSubmitting(false);
          },
          ...props,
        }}
        ref={scannerInputRef}
      />
      {!hideEnterButton ? (
        <StyledButton
          label={stringConstants.Button.Enter}
          styles={buttonStyle.buttonStyle}
          type="tertiary"
          size="slim"
          testID="ScannerInputScanButton"
          isDisabled={submitting || value.length === 0}
          onPress={async () => {
            setSubmitting(true);
            await onSubmitBarcode(value.trim(), true);
            setValue("");
            setSubmitting(false);
          }}
        />
      ) : null}
    </Box>
  );
};
