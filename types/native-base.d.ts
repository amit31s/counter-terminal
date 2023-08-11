import { customTheme } from "../src/common";

type CustomThemeType = typeof customTheme;

declare module "native-base" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ICustomTheme extends CustomThemeType {}
}
