import { StyledUtilityLoopIcon } from "@ct/assets/icons";
import { getLoadingStatus, useAppSelector, useSpinnerAnimation } from "@ct/common";
import { CustomModal } from "@ct/components/CustomModal";
import { last } from "lodash";
import { ReactElement } from "react";
import { Animated } from "react-native";

function LoadingModal(): ReactElement {
  const loadingStatus = useAppSelector(getLoadingStatus);
  const { icon, title, testID, ...rest } = last(loadingStatus)?.modalProps ?? {};

  const animationStyle = useSpinnerAnimation();

  return (
    <CustomModal
      testID={testID ?? "LoadingModalTestID"}
      isOpen={loadingStatus.length > 0}
      icon={
        icon ?? (
          <Animated.View style={animationStyle}>
            <StyledUtilityLoopIcon />
          </Animated.View>
        )
      }
      title={title ?? "Loading..."}
      {...rest}
    />
  );
}

export default LoadingModal;
