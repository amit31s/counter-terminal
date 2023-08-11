import { Screen, ScreenHeader, ScreenLayout } from "@ct/common";
import { HelpScreen } from "@ct/common/components/HelpScreen";
import { NavigationPanel } from "@ct/common/components/NavigationPanel";
import { useHomeScreen } from "@ct/common/hooks";
import { HomeScreenLeftPanel, HomeScreenRightPanel } from "@ct/features";
import { JourneyInterruptionTypes } from "@ct/features/HomeScreenFeature/HomeScreenLeftPanel/Journey/InputBar/JourneyInterruptionTypes.enum";
import { HomeButtonModal } from "@ct/screens/HomeScreen/HomeButtonModal";
import { View } from "native-base";
import { ProviderProps } from "postoffice-spm-journey-engine";
import { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native";
import { JourneyInterruptContext } from "./JourneyInterruptContext";

export const HomeScreen = () => {
  useHomeScreen();

  const scannerInputRef = useRef<TextInput>(null);
  const [interruptionInputData, setInterruptionInputData] =
    useState<ProviderProps["interruptionInputData"]>(undefined);
  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [showHelpScreen, setShowHelpScreen] = useState(false);

  const journeyReset = useCallback(() => {
    setInterruptionInputData({ type: JourneyInterruptionTypes.Reset, value: "" });
    setTimeout(function () {
      setInterruptionInputData(undefined);
    }, 300);
  }, []);

  const handleHomePress = useCallback(() => {
    setShowNavigationMenu(false);
    setHomeModalOpen(true);
  }, []);

  const handleNavigationMenu = (buttonName: string) => {
    switch (buttonName) {
      case "Menu":
        setShowNavigationMenu(!showNavigationMenu);
        break;
      case "Help":
        setShowHelpScreen(!showHelpScreen);
        break;
      default:
        setShowNavigationMenu(false);
    }
  };

  return (
    <Screen>
      <View flex={1}>
        <JourneyInterruptContext.Provider
          value={{ interruptionInputData, setInterruptionInputData, journeyReset }}
        >
          <ScreenHeader
            onHomePress={handleHomePress}
            helpVisible={showHelpScreen}
            onNavButtonPress={(buttonName) => handleNavigationMenu(buttonName)}
          />
          <HelpScreen showHelpScreen={showHelpScreen} />
          {showNavigationMenu && <NavigationPanel setShowNavigationMenu={setShowNavigationMenu} />}
          <ScreenLayout>
            <ScreenLayout.LeftPanel>
              <HomeScreenLeftPanel scannerInputRef={scannerInputRef} />
            </ScreenLayout.LeftPanel>
            <ScreenLayout.RightPanel>
              <HomeScreenRightPanel scannerInputRef={scannerInputRef} />
            </ScreenLayout.RightPanel>
          </ScreenLayout>
        </JourneyInterruptContext.Provider>
      </View>
      <HomeButtonModal
        homeModalOpen={homeModalOpen}
        setHomeModalOpen={setHomeModalOpen}
        journeyReset={journeyReset}
      />
    </Screen>
  );
};
