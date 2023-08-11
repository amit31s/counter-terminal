import useWindowSize from "@ct/common/hooks/useWindowSize";
import { CustomModal, CustomModalProps } from "@ct/components";
import { colorConstants, stringConstants, Styles } from "@ct/constants";
import { View } from "native-base";
import { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import NavigationPanelButtonActions from "./NavigationPanelButtonActions";
import { NavigationPanelHeader } from "./NavigationPanelHeader";

const navPanelStyle = StyleSheet.create({
  panelMargin: {
    marginRight: Styles.hamburgerMenuItemMarginRight,
  },
  panelMarginZero: {
    marginRight: 0,
  },
});
type NavPanelItemType = {
  row: number;
  title: string;
  items: string[];
};

type PanelItemType = {
  panelArray: NavPanelItemType[];
  onItemPressed: (selectedItem: string) => void;
};
interface NavigationPanelProps {
  setShowNavigationMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function PanelItems({ panelArray, onItemPressed }: PanelItemType) {
  return (
    <View
      key={panelArray[0].title}
      flex={1}
      style={
        panelArray[0].row === 1 || panelArray[0].row === 2
          ? navPanelStyle.panelMargin
          : navPanelStyle.panelMarginZero
      }
    >
      <View flex={1}>
        <NavigationPanelHeader
          title={panelArray[0].title}
          items={panelArray[0].items}
          onItemPressed={(selectedItem) => onItemPressed(selectedItem)}
        />
      </View>
      {panelArray.length > 1 && (
        <View flex={1}>
          <NavigationPanelHeader
            title={panelArray[1].title}
            items={panelArray[1].items}
            onItemPressed={(selectedItem) => onItemPressed(selectedItem)}
          />
        </View>
      )}
    </View>
  );
}

export const NavigationPanel = ({ setShowNavigationMenu }: NavigationPanelProps) => {
  const [_selectedItemFromNavigationPanel, setSelectedItemFromNavigationPanel] =
    useState<string>("");
  const [modal, setModal] = useState<CustomModalProps | null>(null);
  const windowDimensions = useWindowSize();

  const hamburgerActions = NavigationPanelButtonActions({
    setModal,
    setShowNavigationMenu,
    setSelectedItemFromNavigationPanel,
  });

  const onItemPressed = (selectedItem: string) => {
    if (hamburgerActions[selectedItem]) {
      return hamburgerActions[selectedItem]();
    }
    hamburgerActions.handleDevelopmentInProgress(selectedItem);
  };
  // TODO: Un-necessary to repeat this Component render 5 times, once UI agreed tidy this up.
  return (
    <>
      <TouchableWithoutFeedback
        testID="navigationPanelBackground"
        onPress={() => {
          onItemPressed("");
        }}
      >
        <View
          position="absolute"
          width={windowDimensions.width}
          height={windowDimensions.height - Styles.screenHeaderHeight}
          marginTop="96px"
          bgColor="rgba(34, 34, 34, 0.2)"
          zIndex={2}
        />
      </TouchableWithoutFeedback>
      <View
        testID="navigationPanelLayout"
        position="absolute"
        width={Styles.hamburgerMenuItemWidth * 3 + Styles.screenHeaderHeight}
        height={windowDimensions.height - Styles.screenHeaderHeight}
        marginTop="96px"
        padding={"24px"}
        bgColor={colorConstants.blue}
        zIndex={2}
        borderTopWidth={2}
        borderTopColor={colorConstants.white}
        flexDirection="row"
      >
        {stringConstants.NavigationPanel.navigationArray.map((item, index) => {
          return (
            <PanelItems
              key={index}
              panelArray={item as unknown as NavPanelItemType[]}
              onItemPressed={(selectedItem) => onItemPressed(selectedItem)}
            />
          );
        })}
      </View>
      {modal !== null && <CustomModal {...modal} />}
    </>
  );
};
