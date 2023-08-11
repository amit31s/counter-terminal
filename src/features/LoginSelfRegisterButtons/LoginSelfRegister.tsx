import { assertNever, PressableText, useFeatureFlag } from "@ct/common";
import { SCREENS, SELF_REGISTER_URLS, stringConstants } from "@ct/constants";
import { featureFlags } from "@ct/constants/featureFlags";
import { Box } from "native-base";
import { useNavigate } from "react-router-dom";

const buttonText = {
  register: stringConstants.Button.register,
  forgotPassword: stringConstants.Button.forgotPassword,
  unlock: stringConstants.Button.unlock,
};

export const LoginSelfRegister = () => {
  const navigate = useNavigate();
  const [shouldShowSelfRegister] = useFeatureFlag(featureFlags.selfRegisterButtons);

  const { forgotPasswordUrl, registerUrl, unlockUrl } = SELF_REGISTER_URLS;

  const actions = Object.values(buttonText);

  const navigateToUrl = (url: string) => navigate(SCREENS.SELF_REGISTER, { state: { url } });

  const handleButtonPress = ({ id }: { id: "Register" | "Forgot password" | "Unlock" }) => {
    switch (id) {
      case buttonText.register:
        navigateToUrl(registerUrl);
        break;
      case buttonText.forgotPassword:
        navigateToUrl(forgotPasswordUrl);
        break;
      case buttonText.unlock:
        navigateToUrl(unlockUrl);
        break;
      default:
        assertNever(id);
    }
  };

  if (!shouldShowSelfRegister) {
    return null;
  }

  return (
    <Box mt={4}>
      {actions.map((action, i) => (
        <Box key={i} mt={4}>
          <PressableText key={i} id={action} onChange={handleButtonPress} text={action} />
        </Box>
      ))}
    </Box>
  );
};
