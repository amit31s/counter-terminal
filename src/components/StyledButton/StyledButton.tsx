import {
  ForwardedRef,
  forwardRef,
  memo,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { GestureResponderEvent, Pressable, Text, TextStyle, View, ViewStyle } from "react-native";
import {
  buttonStyles,
  disabledButtonStyles,
  disabledTextStyles,
  hoverButtonStyles,
  hoverTextStyles,
  pressedButtonStyles,
  pressedTextStyles,
  textStyles,
} from "./buttonStyles";

export type StyledButtonSize = "default" | "slim";

export type StyledButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "invertedPrimary"
  | "invertedSecondary";

export type StyledButtonProps = PropsWithChildren<{
  label: string;
  size?: StyledButtonSize;
  type?: StyledButtonType;
  isDisabled?: boolean;
  testID?: string;
  styles?: ViewStyle | ViewStyle[];
  textStyles?: TextStyle | TextStyle[];
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
}>;

const StyledButton = (
  {
    children,
    label,
    size = "default",
    type = "primary",
    testID,
    isDisabled,
    styles: passedStyles,
    textStyles: passedTextStyles,
    onPress,
  }: StyledButtonProps,
  ref?: ForwardedRef<View>,
): ReactElement => {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const styles = useMemo(() => {
    const tmp: ViewStyle[] = [buttonStyles.base];

    if (size === "slim") {
      tmp.push(buttonStyles.slim);
    }

    if (isDisabled) {
      tmp.push(disabledButtonStyles[type]);
    } else if (pressed) {
      tmp.push(pressedButtonStyles[type]);
    } else if (hovered) {
      tmp.push(hoverButtonStyles[type]);
    } else {
      tmp.push(buttonStyles[type]);
    }

    if (passedStyles) {
      if (passedStyles instanceof Array) {
        tmp.push(...passedStyles);
      } else {
        tmp.push(passedStyles);
      }
    }

    return tmp;
  }, [hovered, isDisabled, passedStyles, pressed, size, type]);

  const stylesText = useMemo(() => {
    const tmp: TextStyle[] = [textStyles.base];

    if (isDisabled) {
      tmp.push(disabledTextStyles[type]);
    } else if (pressed) {
      tmp.push(pressedTextStyles[type]);
    } else if (hovered) {
      tmp.push(hoverTextStyles[type]);
    } else {
      tmp.push(textStyles[type]);
    }

    if (passedTextStyles) {
      if (passedTextStyles instanceof Array) {
        tmp.push(...passedTextStyles);
      } else {
        tmp.push(passedTextStyles);
      }
    }

    return tmp;
  }, [hovered, isDisabled, passedTextStyles, pressed, type]);

  const handleHoverIn = useCallback(() => {
    setHovered(true);
  }, []);
  const handleHoverOut = useCallback(() => {
    setHovered(false);
  }, []);

  const handlePressIn = useCallback(() => {
    setPressed(true);
  }, []);
  const handlePressOut = useCallback(() => {
    setPressed(false);
  }, []);

  return (
    <Pressable
      ref={ref}
      testID={testID}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {children ? (
        children
      ) : (
        <Text selectable={false} style={stylesText}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default memo(forwardRef<View, StyledButtonProps>(StyledButton));
