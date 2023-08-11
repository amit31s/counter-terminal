import { IPressableProps, Pressable } from "native-base";
import { ReactNode } from "react";
import { Animated, ViewStyle } from "react-native";
import { useSpringPressable } from "../../hooks";

interface SpringPressableChangeParams<S> {
  buttonId?: S;
}

type SpringPressableChangeType<S> = (params: SpringPressableChangeParams<S>) => void;

export type SpringPressableProps<S extends string | number | T, T> = IPressableProps & {
  children?: ReactNode;
  buttonId?: S;
  text?: string;
  onChange?: SpringPressableChangeType<S>;
  style?: ViewStyle;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export const SpringPressable = <S extends string | number | T, T>({
  children,
  buttonId,
  style,
  testID,
  onChange,
  ...props
}: SpringPressableProps<S, T>) => {
  const { handleSpringPress, animatedStyle } = useSpringPressable({
    style,
  });

  const idToString = buttonId !== undefined ? `${buttonId}` : undefined;

  const handlePressAction = () => onChange && onChange({ buttonId });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        flex={1}
        testID={idToString || testID}
        alignItems="center"
        justifyContent="center"
        onPress={handlePressAction}
        onPressIn={() => {
          handleSpringPress(true);
        }}
        onPressOut={() => {
          handleSpringPress(false);
        }}
        _focusVisible={{
          _web: {
            style: {},
          },
        }}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
