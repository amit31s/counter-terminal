import { colorConstants } from "@ct/constants";
import { StyledButtonType } from "./StyledButton";

type ButtonColors = {
  bgColor: string;
  borderColor: string;
  textColor: string;
};

type ButtonState = "default" | "hover" | "pressed" | "focused" | "disabled";

const colors: Record<StyledButtonType, Record<ButtonState, ButtonColors>> = {
  primary: {
    default: {
      bgColor: colorConstants.buttonColors.red,
      borderColor: colorConstants.buttonColors.red,
      textColor: colorConstants.buttonColors.white,
    },
    hover: {
      bgColor: colorConstants.buttonColors.hover.red,
      borderColor: colorConstants.buttonColors.hover.red,
      textColor: colorConstants.buttonColors.white,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.pressed.red,
      borderColor: colorConstants.buttonColors.pressed.red,
      textColor: colorConstants.buttonColors.white,
    },
    focused: {
      bgColor: colorConstants.buttonColors.hover.red,
      borderColor: colorConstants.buttonColors.hover.red,
      textColor: colorConstants.buttonColors.white,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.red,
      borderColor: colorConstants.buttonColors.disabled.red,
      textColor: colorConstants.buttonColors.disabled.whiteText,
    },
  },
  secondary: {
    default: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.teritary,
      textColor: colorConstants.buttonColors.teritary,
    },
    hover: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.teritary,
      textColor: colorConstants.buttonColors.teritary,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.pressed.blue,
      textColor: colorConstants.buttonColors.teritary,
    },
    focused: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.teritary,
      textColor: colorConstants.buttonColors.teritary,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.white,
      borderColor: colorConstants.buttonColors.disabled.whiteBorder,
      textColor: colorConstants.buttonColors.disabled.purpleText,
    },
  },
  tertiary: {
    default: {
      bgColor: colorConstants.buttonColors.teritary,
      borderColor: colorConstants.buttonColors.teritary,
      textColor: colorConstants.buttonColors.white,
    },
    hover: {
      bgColor: colorConstants.buttonColors.hover.blue,
      borderColor: colorConstants.buttonColors.hover.blue,
      textColor: colorConstants.buttonColors.white,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.pressed.blue,
      borderColor: colorConstants.buttonColors.pressed.blue,
      textColor: colorConstants.buttonColors.white,
    },
    focused: {
      bgColor: colorConstants.buttonColors.hover.blue,
      borderColor: colorConstants.buttonColors.hover.blue,
      textColor: colorConstants.buttonColors.white,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.blue,
      borderColor: colorConstants.buttonColors.disabled.blue,
      textColor: colorConstants.buttonColors.disabled.whiteText,
    },
  },
  quaternary: {
    default: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.white,
      textColor: colorConstants.text.body,
    },
    hover: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.white,
      textColor: colorConstants.text.body,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.pressed.white,
      borderColor: colorConstants.buttonColors.pressed.white,
      textColor: colorConstants.text.body,
    },
    focused: {
      bgColor: colorConstants.buttonColors.pressed.white,
      borderColor: colorConstants.buttonColors.pressed.white,
      textColor: colorConstants.text.body,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.white,
      borderColor: colorConstants.buttonColors.disabled.white,
      textColor: colorConstants.buttonColors.disabled.whiteText,
    },
  },
  invertedPrimary: {
    default: {
      bgColor: colorConstants.buttonColors.white,
      borderColor: colorConstants.buttonColors.white,
      textColor: colorConstants.buttonColors.teritary,
    },
    hover: {
      bgColor: colorConstants.buttonColors.hover.white,
      borderColor: colorConstants.buttonColors.hover.white,
      textColor: colorConstants.buttonColors.teritary,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.pressed.white,
      borderColor: colorConstants.buttonColors.pressed.white,
      textColor: colorConstants.buttonColors.teritary,
    },
    focused: {
      bgColor: colorConstants.buttonColors.hover.white,
      borderColor: colorConstants.buttonColors.hover.white,
      textColor: colorConstants.buttonColors.teritary,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.white,
      borderColor: colorConstants.buttonColors.disabled.white,
      textColor: colorConstants.buttonColors.disabled.whiteText,
    },
  },
  invertedSecondary: {
    default: {
      bgColor: colorConstants.buttonColors.transparent,
      borderColor: colorConstants.buttonColors.white,
      textColor: colorConstants.buttonColors.white,
    },
    hover: {
      bgColor: colorConstants.buttonColors.hover.transparent,
      borderColor: colorConstants.buttonColors.hover.transparent,
      textColor: colorConstants.buttonColors.teritary,
    },
    pressed: {
      bgColor: colorConstants.buttonColors.pressed.transparent,
      borderColor: colorConstants.buttonColors.pressed.transparent,
      textColor: colorConstants.buttonColors.teritary,
    },
    focused: {
      bgColor: colorConstants.buttonColors.hover.transparent,
      borderColor: colorConstants.buttonColors.hover.transparent,
      textColor: colorConstants.buttonColors.teritary,
    },
    disabled: {
      bgColor: colorConstants.buttonColors.disabled.transparent,
      borderColor: colorConstants.buttonColors.disabled.transparentBorder,
      textColor: colorConstants.buttonColors.disabled.transparentBorder,
    },
  },
} as const;

export default colors;
