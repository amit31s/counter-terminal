import { customTheme } from "@ct/common";
import { FontFamily } from "@ct/utils/Scaling/FontFamily";
import { Pressable, Text } from "native-base";
import { Animated, ViewStyle } from "react-native";
import { useSpringPressable } from "../../hooks";

interface PressableTextChangeParams<S extends string> {
  id: S;
}

type PressableTextChangeType<S extends string> = (params: PressableTextChangeParams<S>) => void;

interface PressableTextProps<S extends string> {
  id: S;
  text?: string;
  style?: ViewStyle;
  onChange?: PressableTextChangeType<S>;
}

export function PressableText<S extends string>({
  id,
  text,
  style,
  onChange,
}: PressableTextProps<S>) {
  const { handleSpringPress, isPressed, animatedStyle } = useSpringPressable({
    style,
  });
  const { colors } = customTheme;
  const handlePressAction = () => onChange && onChange({ id });

  const textColour = isPressed ? colors.secondaryColour : colors.white;
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        testID={id}
        onPress={handlePressAction}
        onPressIn={() => {
          handleSpringPress(true);
        }}
        onPressOut={() => {
          handleSpringPress(false);
        }}
      >
        <Text fontFamily={FontFamily.FONT_NUNITO_BOLD} fontSize="2xl" color={textColour}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
