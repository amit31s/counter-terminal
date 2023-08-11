import { StyledUtilityLoopIcon } from "@ct/assets/icons";
import { useSpinnerAnimation } from "@ct/common";
import { CustomModal } from "@ct/components/CustomModal";
import { StyledButton } from "@ct/components/StyledButton";
import { Box, Text } from "native-base";
import { PosDisplayEvent } from "postoffice-peripheral-management-service";
import { ReactElement } from "react";
import { Animated, StyleSheet } from "react-native";

const buttonStyles = StyleSheet.create({
  buttonStyle: {
    marginRight: 32,
  },
});

interface PinPadModalProps {
  modalHeaderTitle?: string;
  headerText?: string;
  isVisible: boolean;
  actions?: PosDisplayEvent[];
  pedActionHandler?: (event: PosDisplayEvent) => Promise<void>;
}

const PinPadModal = ({
  modalHeaderTitle = "",
  headerText = "",
  isVisible,
  actions = [],
  pedActionHandler,
}: PinPadModalProps): ReactElement => {
  const animationStyle = useSpinnerAnimation();
  return (
    <CustomModal
      testID="PinPadModal"
      isOpen={isVisible}
      title={modalHeaderTitle}
      icon={
        <Animated.View style={animationStyle}>
          <StyledUtilityLoopIcon />
        </Animated.View>
      }
      content={
        <>
          <Text textAlign="center">{headerText}</Text>
          {actions.length > 0 && (
            <Box borderTopWidth={0} p={0} mt={8} justifyContent={"center"} flexDir="row-reverse">
              {actions.map((action, i) => (
                <StyledButton
                  key={action.label}
                  type="tertiary"
                  styles={i > 0 ? buttonStyles.buttonStyle : undefined}
                  onPress={async () => {
                    if (!pedActionHandler) {
                      return;
                    }

                    await pedActionHandler(action);
                  }}
                  label={action.label}
                />
              ))}
            </Box>
          )}
        </>
      }
    />
  );
};

export default PinPadModal;
