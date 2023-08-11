import { colorConstants, stringConstants, Styles } from "@ct/constants";
import styled from "@emotion/styled";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import BaseBBOIcon from "@mui/icons-material/DvrOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import { Text, View } from "native-base";
import { NavigationPanelItem } from "../NavigationPanelItem";
type NavigationPanelHeaderProps = {
  title: string;
  items: ReadonlyArray<string>;
  onItemPressed: (selectedItem: string) => void;
};
type HeaderIconProps = {
  title: string;
};
function HeaderIcon({ title }: HeaderIconProps) {
  const iconStyle = {
    color: colorConstants.navigationPanelHeader,
    width: "44px",
    height: "44px",
  } as const;
  const BasketIcon = styled(ShoppingBasketOutlinedIcon)(iconStyle);
  const BackOfficeIcon = styled(BaseBBOIcon)(iconStyle);
  const SettingIcon = styled(SettingsOutlinedIcon)(iconStyle);
  const OthersIcon = styled(AddBoxOutlinedIcon)(iconStyle);
  switch (title) {
    case stringConstants.NavigationPanel.BasketMenuHeader:
      return <BasketIcon />;
    case stringConstants.NavigationPanel.CounterTerminalMenuHeader:
    case stringConstants.NavigationPanel.BackOfficeMenuHeader:
      return <BackOfficeIcon />;
    case stringConstants.NavigationPanel.SystemMenuHeader:
      return <SettingIcon />;
    case stringConstants.NavigationPanel.OtherMenuHeader:
      return <OthersIcon />;
  }
  return <></>;
}
export const NavigationPanelHeader = ({
  title,
  items,
  onItemPressed,
}: NavigationPanelHeaderProps) => {
  return (
    <>
      <View flexDirection={"column"} testID={title + "header"}>
        <View
          flexDirection={"row"}
          alignItems="center"
          width={Styles.hamburgerMenuItemWidth}
          height={Styles.hamburgerMenuItemHeight}
          paddingLeft={"16px"}
          borderBottomColor={colorConstants.navigationPanelHeader}
          borderBottomWidth={1}
        >
          <HeaderIcon title={title} />
          <Text
            testID={title + "Text"}
            fontSize={32}
            fontWeight={"bold"}
            color={colorConstants.navigationPanelHeader}
            paddingLeft="8px"
          >
            {title}
          </Text>
        </View>
        <View flexDirection={"column"}>
          {items.map((item, i) => {
            return (
              <NavigationPanelItem
                title={item}
                key={i}
                onItemPressed={(selectedItem) => onItemPressed(selectedItem)}
              />
            );
          })}
        </View>
      </View>
    </>
  );
};
