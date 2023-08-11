import { StyledButton } from "@ct/components";
import { BUTTON, SCREENS } from "@ct/constants";
import { Flex } from "native-base";
import { StyleSheet } from "react-native";

import { useNavigate } from "react-router-dom";

type SubmitPouchProps = {
  submit: () => void;
  disabled: boolean;
};

const styles = StyleSheet.create({
  base: {
    marginLeft: "24px",
  },
  position: { position: "absolute", bottom: 15 },
});

// Submit pouch buttons for pouch acceptance and dispatch
export const SubmitPouchButton = ({ submit, disabled }: SubmitPouchProps) => {
  const navigate = useNavigate();

  const cancel = () => {
    navigate(SCREENS.HOME, { state: { from: SCREENS.POUCH_ACCEPTANCE } });
  };

  return (
    <Flex direction="row" justifyContent={"center"} style={styles.position}>
      <StyledButton
        testID={"cancel"}
        label={BUTTON.CTBTN0006}
        type="secondary"
        size="slim"
        onPress={cancel}
      />
      <StyledButton
        testID={"confirm"}
        isDisabled={disabled}
        label={BUTTON.CTBTN0008}
        styles={styles.base}
        type="tertiary"
        size="slim"
        onPress={submit}
      />
    </Flex>
  );
};
