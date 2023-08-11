import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export type SpinnerAnimationStyle = {
  transform: [
    {
      rotate: Animated.AnimatedInterpolation<string>;
    },
  ];
};

export function useSpinnerAnimation(): SpinnerAnimationStyle {
  const animation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
        easing: (x) => x,
      }),
    ).start();

    return () => {
      animation.stopAnimation();
    };
  }, [animation]);

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return { transform: [{ rotate: rotateInterpolate }] };
}
