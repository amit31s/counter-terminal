import { customTheme, SpringPressable, SpringPressableProps } from "@ct/common";
import { colorConstants } from "@ct/constants";
import { Text, View } from "native-base";
import { memo, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import styles from "./styles";

export type Props<S extends string | number | T, T> = Omit<
  SpringPressableProps<S, T>,
  "backgroundColor" | "color"
> & {
  isLoading?: boolean;
  variant?: "outlined" | "filled" | "image";
  backgroundColor?: string;
  color?: string;
};

const { colors } = customTheme;

function KeypadButton<S extends string | number | T, T>({
  children,
  isLoading,
  onLayout,
  variant = "outlined",
  backgroundColor = "white",
  text,
  color = colorConstants.buttonColors.teritary,
  disabled,
  testID,
  ...rest
}: Props<S, T>) {
  const buttonStyle = useMemo(() => {
    switch (variant) {
      case "outlined":
      case "image":
        return disabled ? styles.outlinedDisabled : styles.outlined;
      case "filled":
      default:
        return disabled ? styles.filledDisabled : styles.filled;
    }
  }, [disabled, variant]);

  return (
    <SpringPressable
      style={styles.touchable}
      disabled={disabled}
      {...rest}
      onLayout={onLayout}
      nativeID={`keypad-button-${testID}`}
    >
      <View style={styles.btnWrapper} flex={1} shadow={1}>
        <View
          justifyContent="center"
          alignItems="center"
          flex={1}
          style={[styles.numberBtn, { backgroundColor }, buttonStyle]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              {text ? (
                <Text
                  fontFamily="body"
                  fontWeight="700"
                  style={styles.text}
                  color={disabled ? colorConstants.buttonColors.disabled.whiteText : color}
                >
                  {text}
                </Text>
              ) : (
                <View justifyContent="center" alignItems="center">
                  {children}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SpringPressable>
  );
}

export default memo(KeypadButton);
