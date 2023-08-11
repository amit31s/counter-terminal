import KeypadButton from "@ct/features/HomeScreenFeature/HomeScreenRightPanel/Keypad/KeypadButton";
import { Box } from "native-base";
import { memo, ReactChild, ReactElement } from "react";

interface ActionButtonProps {
  parentCallback: () => void;
  ID: string;
  disabled?: boolean;
  image: ReactChild;
}

const ActionButton = ({
  parentCallback,
  ID,
  image,
  disabled = false,
}: ActionButtonProps): ReactElement => {
  return (
    <KeypadButton testID={ID} onPress={parentCallback} disabled={disabled} variant="image">
      <Box w="40px" h="40px" alignItems="center" justifyContent="center">
        {image}
      </Box>
    </KeypadButton>
  );
};

export default memo(ActionButton);
