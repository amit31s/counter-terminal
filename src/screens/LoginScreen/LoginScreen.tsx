import { Screen, ScreenLayout } from "@ct/common";
import { LoginScreenPanel } from "@ct/features";

export const LoginScreen = () => {
  return (
    <Screen>
      <ScreenLayout>
        <LoginScreenPanel />
      </ScreenLayout>
    </Screen>
  );
};
