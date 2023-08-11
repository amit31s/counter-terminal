import useWindowSize from "@ct/common/hooks/useWindowSize";
import { colorConstants, Styles } from "@ct/constants";
import { Box, View, Text } from "native-base";
import { useEffect, useState } from "react";
import { HelpScreenBottomButton } from "./HelpScreenBottomButton";
// import { StyleSheet } from "react-native";

// const navPanelStyle = StyleSheet.create({
//   panel: {
//     marginRight: Styles.hamburgerMenuItemMarginRight,
//   },
// });

type HelpScreenProps = {
  showHelpScreen: boolean;
};
export function HelpScreen({ showHelpScreen }: HelpScreenProps) {
  const [helpScreenWidth, setHelpScreenWidth] = useState(Styles.minimizeHelpScreenWidth);
  const windowDimensions = useWindowSize();
  useEffect(() => {
    if (!showHelpScreen) {
      setHelpScreenWidth(Styles.minimizeHelpScreenWidth);
    }
  }, [showHelpScreen]);
  return (
    <>
      {showHelpScreen && (
        <>
          <Box
            testID="helpScreenLayout"
            position="absolute"
            right={0}
            width={helpScreenWidth}
            height={windowDimensions.height - Styles.screenHeaderHeight}
            marginTop={"96px"}
            padding={"24px"}
            shadow={5}
            bgColor={colorConstants.white}
            zIndex={2}
            borderTopWidth={2}
            borderTopColor={colorConstants.white}
          >
            <View flex={1} justifyContent={"center"} alignItems={"center"}>
              <Text pb="14px" fontSize={24}>
                {"Content under construction. Please check back soon!"}
              </Text>
            </View>
            <View flexDirection={"row"}>
              <HelpScreenBottomButton
                helpScreenWidth={helpScreenWidth}
                setHelpScreenWidth={setHelpScreenWidth}
              />
            </View>
          </Box>
        </>
      )}
    </>
  );
}
