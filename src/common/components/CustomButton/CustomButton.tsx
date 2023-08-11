import { customTheme } from "@ct/common";
import { Center, IPressableProps, Pressable, Text } from "native-base";
import { ReactNode } from "react";
import { ActivityIndicator, Animated, ViewStyle } from "react-native";
import { useSpringPressable } from "../../hooks";
import { customButtonStyles } from "./CustomButton.styles";

interface CustomButtonChangeParams<S> {
  buttonId: S;
}

type CustomButtonChangeType<S> = (params: CustomButtonChangeParams<S>) => void;

type CustomButtonProps<S extends string | number | T, T> = IPressableProps & {
  children?: ReactNode;
  buttonId: S;
  text?: string;
  onChange?: CustomButtonChangeType<S>;
  style?: ViewStyle;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export const CustomButton = <S extends string | number | T, T>({
  children,
  buttonId,
  text,
  style,
  isLoading = false,
  isDisabled = false,
  onChange,
  ...props
}: CustomButtonProps<S, T>) => {
  const { handleSpringPress, animatedStyle } = useSpringPressable({
    style,
  });
  const { w, h } = props;
  const { colors } = customTheme;
  const mainColor = isDisabled ? colors.disableBtnColor : colors.buttonColors.teritary;
  const textColour = isDisabled ? colors.disabledTextColour : colors.primaryButtonTextColour;
  const idToString = (buttonId === typeof "string" ? buttonId : `${buttonId}`) as string;

  const handlePressAction = () => onChange && onChange({ buttonId });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        borderRadius={4}
        testID={idToString}
        disabled={isDisabled}
        h={h || "96px"}
        w={w || "176px"}
        onPress={handlePressAction}
        onPressIn={() => {
          handleSpringPress(true);
        }}
        onPressOut={() => {
          handleSpringPress(false);
        }}
        bg={mainColor}
        {...props}
      >
        <Center flexDirection="row" flex={1} alignItems="center">
          {isLoading && <ActivityIndicator size="small" color={colors.white} />}
          {text ? (
            <Text
              color={textColour}
              fontSize={21}
              fontFamily={"heading"}
              style={customButtonStyles.Btntext}
            >
              {text}
            </Text>
          ) : (
            <>{children}</>
          )}
        </Center>
      </Pressable>
    </Animated.View>
  );
};
