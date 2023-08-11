import { MaterialSymbol } from "@ct/assets/icons";
import { BackOfficePageEnum, generateBackOfficeURL } from "@ct/common/backOfficeUrl";
import { STORAGE_KEYS } from "@ct/common/enums";
import { useAppDispatch, useAppSelector } from "@ct/common/hooks";
import { envProvider } from "@ct/common/platformHelper";
import { touchKeyboardSelector } from "@ct/common/selectors";
import { signOutUser } from "@ct/common/state/auth.slice";
import {
  setTouchKeyboardEnabled,
  toggleTouchKeyboardEnabled,
} from "@ct/common/state/touchKeyboard.slice";
import { SCREENS, colorConstants } from "@ct/constants";
import { setItem } from "@ct/utils";
import styled from "@emotion/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Text } from "native-base";
import { Breadcrumb, Button } from "postoffice-spm-components";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div({
  display: "flex",
  flexWrap: "nowrap",
  gap: "2px",
  backgroundColor: "white",
  height: "96px",
});

const TitleContainer = styled.div({
  flex: 1,
  display: "flex",
  backgroundColor: colorConstants.blue,
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "16px",
  paddingLeft: "16px",
});

type ScreenHeaderProps = {
  hideHome?: boolean;
  helpVisible?: boolean;
  onHomePress?: () => void;
  onNavButtonPress: (buttonTitle: string) => void;
  showNavigationMenu?: boolean;
  title?: string;
};
export function ScreenHeader({
  title,
  hideHome,
  helpVisible,
  onHomePress,
  onNavButtonPress,
}: ScreenHeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { enabled: touchKeyboardEnabled } = useAppSelector(touchKeyboardSelector);
  const disable = pathname === SCREENS.CASH_DRAWER;

  const handleHomePress = useCallback(() => {
    onNavButtonPress("Home");
    navigate({ pathname: SCREENS.HOME }, { state: { from: pathname } });
  }, [navigate, onNavButtonPress, pathname]);

  const handleBackOfficeClick = useCallback(() => {
    onNavButtonPress("BackOffice");
    setItem(STORAGE_KEYS.CTSTK0003, BackOfficePageEnum.taskManagement);
    if (envProvider.REACT_APP_USING_ELECTRON === "true") {
      window.electronAPI?.launchBo();
      return;
    }
    window.open(generateBackOfficeURL());
  }, [onNavButtonPress]);

  const handleKeyboardClick = useCallback(() => {
    onNavButtonPress("Keypad");
    dispatch(toggleTouchKeyboardEnabled());
  }, [dispatch, onNavButtonPress]);

  const handleLockClick = useCallback(() => {
    onNavButtonPress("Lock");
    dispatch(setTouchKeyboardEnabled(false));
    dispatch(signOutUser());
  }, [dispatch, onNavButtonPress]);

  return (
    <Container>
      <Button
        size="icon"
        title="Menu"
        onPress={() => onNavButtonPress("Menu")}
        disabled={disable}
        icon={<MaterialSymbol name="menu" />}
      />
      <TitleContainer>
        {hideHome ? (
          <div />
        ) : (
          <>
            <Breadcrumb onPress={onHomePress ?? handleHomePress} disabled={disable} />
            {!title ? null : <ArrowForwardIosIcon htmlColor="#D9D9D9" />}
          </>
        )}
        <Text variant="large" color="white">
          {title}
        </Text>
      </TitleContainer>
      <Button
        size="icon"
        title="Keypad"
        icon={<MaterialSymbol name={touchKeyboardEnabled ? "keyboard" : "keyboard_off"} />}
        onPress={handleKeyboardClick}
      />
      <Button
        size="icon"
        title="Back Office"
        icon={<MaterialSymbol name="dvr" />}
        onPress={handleBackOfficeClick}
      />
      <Button
        size="icon"
        variant={helpVisible ? "secondary" : "primary"}
        title={helpVisible ? "Close help" : "Help"}
        icon={
          <MaterialSymbol
            name={helpVisible ? "cancel" : "help"}
            color={helpVisible ? colorConstants.blue : colorConstants.white}
          />
        }
        onPress={() => onNavButtonPress("Help")}
      />
      <Button
        size="icon"
        title="Lock"
        icon={<MaterialSymbol name="lock" />}
        onPress={handleLockClick}
      />
    </Container>
  );
}
