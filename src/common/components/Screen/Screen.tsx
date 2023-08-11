import { ReactNode, useState } from "react";
import { HelpScreen } from "../HelpScreen";
import { NavigationPanel } from "../NavigationPanel";
import { ScreenHeader } from "../ScreenHeader";

interface ScreenProps {
  title?: string;
  hideHome?: boolean;
  children: ReactNode;
}

// Screen wrapper component for any common actions to be carried out.
// Will be especially handy for deep linking.
// Should be used to wrap each screen of the app
export const Screen = ({ title, hideHome, children }: ScreenProps) => {
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [showHelpScreen, setShowHelpScreen] = useState(false);

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
    <>
      {title && (
        <>
          <ScreenHeader
            hideHome={hideHome}
            helpVisible={showHelpScreen}
            onNavButtonPress={(buttonName) => handleNavigationMenu(buttonName)}
            title={title}
          />
          <HelpScreen showHelpScreen={showHelpScreen} />
          {showNavigationMenu && <NavigationPanel setShowNavigationMenu={setShowNavigationMenu} />}
        </>
      )}
      {children}
    </>
  );
};
