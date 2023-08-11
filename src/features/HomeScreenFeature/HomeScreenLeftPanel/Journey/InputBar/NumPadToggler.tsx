import { getNumpadFlag, useAppDispatch } from "@ct/common";
import { updateNumpadFlagStatus } from "@ct/common/state/HomeScreen/updateNumpadFlag.slice";
import { StyledNumpadIcon } from "@ct/assets/icons";
import { stringConstants } from "@ct/constants";
import { Box, Flex, Switch, Text } from "native-base";
import { useState } from "react";
import { useSelector } from "react-redux";

// TODO: removed from CT as part BMCT-262 possibly can delete this entire component!!

export const NumPadToggler = () => {
  const dispatch = useAppDispatch();
  const numpadFlag = useSelector(getNumpadFlag);
  const [isEnabled, setIsEnabled] = useState(numpadFlag.flag);
  const dispatchFlagData = () => {
    dispatch(
      updateNumpadFlagStatus({
        flag: !numpadFlag.flag,
      }),
    );
  };

  const toggleSwitch = (status: boolean) => {
    setIsEnabled(status);
    dispatchFlagData();
  };

  return (
    <Flex direction="row" marginLeft="56px" alignItems="center">
      <Box w="32px" h="32px" alignItems="center" justifyContent="center">
        <StyledNumpadIcon />
      </Box>
      <Box marginLeft="12px">
        <Text
          fontWeight="normal"
          fontSize="18px"
          lineHeight="28px"
          fontFamily="body"
          marginRight={isEnabled ? "8px" : "0px"}
        >
          {isEnabled
            ? stringConstants.HomeScreen.hideNumPad
            : stringConstants.HomeScreen.showNumPad}
        </Text>
      </Box>
      <Switch
        ml="12px"
        trackColor={{ false: "#B2B6C7", true: "#293462" }}
        thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled}
        isChecked={isEnabled}
        margin={0}
        size={undefined}
      />
    </Flex>
  );
};
