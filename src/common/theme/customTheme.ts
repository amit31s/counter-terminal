import { extendTheme } from "native-base";
import { COLOR_CONSTANTS } from "../../constants/ColorConstants";
import { components } from "./componentThemes";
import { fontConfig, fonts } from "./typography";

/**
 * * you can add extended native base components here:
 * e.g.:
  components: customTheme.components,
 */

export const customTheme = extendTheme({
  colors: COLOR_CONSTANTS,
  fonts,
  components,
  fontConfig,
} as const);
