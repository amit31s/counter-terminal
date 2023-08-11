import { StyleSheet } from "react-native";
import buttonColors from "./buttonColors";

export const buttonStyles = StyleSheet.create({
  base: {
    alignSelf: "center",
    paddingHorizontal: 56,
    height: 85,
    minHeight: 85,
    shadow: 4,
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  slim: {
    height: 72,
    minHeight: 72,
  },
  primary: {
    backgroundColor: buttonColors.primary.default.bgColor,
    borderColor: buttonColors.primary.default.borderColor,
  },
  secondary: {
    backgroundColor: buttonColors.secondary.default.bgColor,
    borderColor: buttonColors.secondary.default.borderColor,
  },
  tertiary: {
    backgroundColor: buttonColors.tertiary.default.bgColor,
    borderColor: buttonColors.tertiary.default.borderColor,
  },
  quaternary: {
    backgroundColor: buttonColors.quaternary.default.bgColor,
    borderColor: buttonColors.quaternary.default.borderColor,
  },
  invertedPrimary: {
    backgroundColor: buttonColors.invertedPrimary.default.bgColor,
    borderColor: buttonColors.invertedPrimary.default.borderColor,
  },
  invertedSecondary: {
    backgroundColor: buttonColors.invertedSecondary.default.bgColor,
    borderColor: buttonColors.invertedSecondary.default.borderColor,
  },
});

export const textStyles = StyleSheet.create({
  base: {
    fontFamily: "'Nunito Sans'",
    fontWeight: "700",
    fontSize: 24,
  },
  primary: {
    color: buttonColors.primary.default.textColor,
  },
  secondary: {
    color: buttonColors.secondary.default.textColor,
  },
  tertiary: {
    color: buttonColors.tertiary.default.textColor,
  },
  quaternary: {
    color: buttonColors.quaternary.default.textColor,
  },
  invertedPrimary: {
    color: buttonColors.invertedPrimary.default.textColor,
  },
  invertedSecondary: {
    color: buttonColors.invertedSecondary.default.textColor,
  },
});

export const hoverButtonStyles = StyleSheet.create({
  primary: {
    backgroundColor: buttonColors.primary.hover.bgColor,
    borderColor: buttonColors.primary.hover.borderColor,
  },
  secondary: {
    backgroundColor: buttonColors.secondary.hover.bgColor,
    borderColor: buttonColors.secondary.hover.borderColor,
  },
  tertiary: {
    backgroundColor: buttonColors.tertiary.hover.bgColor,
    borderColor: buttonColors.tertiary.hover.borderColor,
  },
  quaternary: {
    backgroundColor: buttonColors.quaternary.hover.bgColor,
    borderColor: buttonColors.quaternary.hover.borderColor,
  },
  invertedPrimary: {
    backgroundColor: buttonColors.invertedPrimary.hover.bgColor,
    borderColor: buttonColors.invertedPrimary.hover.borderColor,
  },
  invertedSecondary: {
    backgroundColor: buttonColors.invertedSecondary.hover.bgColor,
    borderColor: buttonColors.invertedSecondary.hover.borderColor,
  },
});

export const hoverTextStyles = StyleSheet.create({
  primary: {
    color: buttonColors.primary.hover.textColor,
  },
  secondary: {
    color: buttonColors.secondary.hover.textColor,
  },
  tertiary: {
    color: buttonColors.tertiary.hover.textColor,
  },
  quaternary: {
    color: buttonColors.quaternary.hover.textColor,
  },
  invertedPrimary: {
    color: buttonColors.invertedPrimary.hover.textColor,
  },
  invertedSecondary: {
    color: buttonColors.invertedSecondary.hover.textColor,
  },
});

export const focusedButtonStyles = StyleSheet.create({
  primary: {
    backgroundColor: buttonColors.primary.focused.bgColor,
    borderColor: buttonColors.primary.focused.borderColor,
  },
  secondary: {
    backgroundColor: buttonColors.secondary.focused.bgColor,
    borderColor: buttonColors.secondary.focused.borderColor,
  },
  tertiary: {
    backgroundColor: buttonColors.tertiary.focused.bgColor,
    borderColor: buttonColors.tertiary.focused.borderColor,
  },
  quaternary: {
    backgroundColor: buttonColors.quaternary.focused.bgColor,
    borderColor: buttonColors.quaternary.focused.borderColor,
  },
  invertedPrimary: {
    backgroundColor: buttonColors.invertedPrimary.focused.bgColor,
    borderColor: buttonColors.invertedPrimary.focused.borderColor,
  },
  invertedSecondary: {
    backgroundColor: buttonColors.invertedSecondary.focused.bgColor,
    borderColor: buttonColors.invertedSecondary.focused.borderColor,
  },
});

export const focusedTextStyles = StyleSheet.create({
  primary: {
    color: buttonColors.primary.focused.textColor,
  },
  secondary: {
    color: buttonColors.secondary.focused.textColor,
  },
  tertiary: {
    color: buttonColors.tertiary.focused.textColor,
  },
  quaternary: {
    color: buttonColors.quaternary.focused.textColor,
  },
  invertedPrimary: {
    color: buttonColors.invertedPrimary.focused.textColor,
  },
  invertedSecondary: {
    color: buttonColors.invertedSecondary.focused.textColor,
  },
});

export const pressedButtonStyles = StyleSheet.create({
  primary: {
    backgroundColor: buttonColors.primary.pressed.bgColor,
    borderColor: buttonColors.primary.pressed.borderColor,
  },
  secondary: {
    backgroundColor: buttonColors.secondary.pressed.bgColor,
    borderColor: buttonColors.secondary.pressed.borderColor,
  },
  tertiary: {
    backgroundColor: buttonColors.tertiary.pressed.bgColor,
    borderColor: buttonColors.tertiary.pressed.borderColor,
  },
  quaternary: {
    backgroundColor: buttonColors.quaternary.pressed.bgColor,
    borderColor: buttonColors.quaternary.pressed.borderColor,
  },
  invertedPrimary: {
    backgroundColor: buttonColors.invertedPrimary.pressed.bgColor,
    borderColor: buttonColors.invertedPrimary.pressed.borderColor,
  },
  invertedSecondary: {
    backgroundColor: buttonColors.invertedSecondary.pressed.bgColor,
    borderColor: buttonColors.invertedSecondary.pressed.borderColor,
  },
});

export const pressedTextStyles = StyleSheet.create({
  primary: {
    color: buttonColors.primary.pressed.textColor,
  },
  secondary: {
    color: buttonColors.secondary.pressed.textColor,
  },
  tertiary: {
    color: buttonColors.tertiary.pressed.textColor,
  },
  quaternary: {
    color: buttonColors.quaternary.pressed.textColor,
  },
  invertedPrimary: {
    color: buttonColors.invertedPrimary.pressed.textColor,
  },
  invertedSecondary: {
    color: buttonColors.invertedSecondary.pressed.textColor,
  },
});

export const disabledButtonStyles = StyleSheet.create({
  primary: {
    backgroundColor: buttonColors.primary.disabled.bgColor,
    borderColor: buttonColors.primary.disabled.borderColor,
  },
  secondary: {
    backgroundColor: buttonColors.secondary.disabled.bgColor,
    borderColor: buttonColors.secondary.disabled.borderColor,
  },
  tertiary: {
    backgroundColor: buttonColors.tertiary.disabled.bgColor,
    borderColor: buttonColors.tertiary.disabled.borderColor,
  },
  quaternary: {
    backgroundColor: buttonColors.quaternary.disabled.bgColor,
    borderColor: buttonColors.quaternary.disabled.borderColor,
  },
  invertedPrimary: {
    backgroundColor: buttonColors.invertedPrimary.disabled.bgColor,
    borderColor: buttonColors.invertedPrimary.disabled.borderColor,
  },
  invertedSecondary: {
    backgroundColor: buttonColors.invertedSecondary.disabled.bgColor,
    borderColor: buttonColors.invertedSecondary.disabled.borderColor,
  },
});

export const disabledTextStyles = StyleSheet.create({
  primary: {
    color: buttonColors.primary.disabled.textColor,
  },
  secondary: {
    color: buttonColors.secondary.disabled.textColor,
  },
  tertiary: {
    color: buttonColors.tertiary.disabled.textColor,
  },
  quaternary: {
    color: buttonColors.quaternary.disabled.textColor,
  },
  invertedPrimary: {
    color: buttonColors.invertedPrimary.disabled.textColor,
  },
  invertedSecondary: {
    color: buttonColors.invertedSecondary.disabled.textColor,
  },
});
