import { MaterialSymbol } from "@ct/assets/icons";
import { useAppSelector, useGetSuspendedBasket } from "@ct/common/hooks";
import { getBasket } from "@ct/common/selectors";
import { colorConstants, stringConstants } from "@ct/constants";
import {
  getCommitedItems,
  isCommitInitiated,
} from "@ct/features/HomeScreenFeature/homeScreen.helper";
import { MenuItemCell } from "postoffice-spm-components";
import { useEffect, useState } from "react";
type NavigationPanelItemProps = {
  key: number;
  title: string;
  onItemPressed: (title: string) => void;
};

const activeItemsInBasketProcessing = [
  "Suspend basket",
  "Stock check",
  "Devices",
  "System info",
  "Licences",
];

export function NavigationPanelItem({ key, title, onItemPressed }: NavigationPanelItemProps) {
  const [isDisable, setDisable] = useState(false);
  const { basketItems } = useAppSelector(getBasket);

  const { existsSuspendBasket } = useGetSuspendedBasket();
  const { count } = getCommitedItems(basketItems);
  const commitInitiated = isCommitInitiated(basketItems);

  useEffect(() => {
    if (title === stringConstants.Button.RecallBasket) {
      // BMCT-138 recall Basket button check
      const recallButtonStatus = basketItems.length > 0;
      setDisable(existsSuspendBasket ? recallButtonStatus : true);
    } else if (title === stringConstants.Button.SuspendBasket) {
      // BMCT-138 suspend Basket button check
      const suspendButtonStatus = basketItems.length === 0 || count > 0 || commitInitiated;
      setDisable(!existsSuspendBasket ? suspendButtonStatus : true);
    } else if (basketItems.length > 0) {
      if (activeItemsInBasketProcessing.includes(title)) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  }, [basketItems.length, commitInitiated, count, existsSuspendBasket, title]);

  return (
    <MenuItemCell
      key={key}
      testID={`navigation_panel_item_${title}`}
      onPress={() => onItemPressed(title)}
      icon={
        <MaterialSymbol
          name="arrow_forward"
          color={isDisable ? colorConstants.navigationItemDisable : colorConstants.white}
        />
      }
      title={title}
      disabled={isDisable}
    />
  );
}
