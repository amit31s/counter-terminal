import { colorConstants } from "@ct/constants";

export const components = {
  Modal: {
    baseStyle: {
      _backdropFade: { exitDuration: 1, entryDuration: 1 },
      _fade: { exitDuration: 1, entryDuration: 1 },
    },
  },
  Button: {
    baseStyle: {
      rounded: "sm",
    },
    variants: {
      primary: {
        bg: "buttonColors.red",
        _text: { color: "white" },
      },
      secondary: {
        w: "252px",
        h: "96px",
        _text: { color: "white" },
        bg: "buttonColors.purple",
      },
      disabled: {
        _text: { color: "text.disabled" },
      },
      outline: {
        _text: { color: "black" },
        borderColor: "borderColors.grey",
        _hover: { bg: "transparent" },
      },
    },
  },
  Text: {
    baseStyle: {
      // default style of medium https://www.figma.com/file/Hbnqw5A3LrKdbZHA1ui9QE/PO-(CFG)---Component-Library?node-id=3987%3A1052
      fontFamily: "body",
      fontSize: "24px",
      lineHeight: "34px",
      fontWeight: 400,
      fontStyle: "normal",
      _light: {
        color: colorConstants.text.title,
      },
      _dark: {
        color: colorConstants.text.title,
      },
    },
    variants: {
      "extra-extra-large": {
        fontFamily: "heading",
        fontSize: "54px",
        lineHeight: "60px",
        fontWeight: 700,
      },
      "extra-large": {
        fontFamily: "heading",
        fontSize: "40px",
        lineHeight: "48px",
        fontWeight: 700,
      },
      large: {
        fontFamily: "heading",
        fontSize: "30px",
        lineHeight: "40px",
        fontWeight: 700,
      },
      "medium-bold": {
        fontWeight: 700,
      },
      "medium-semi-bold": {
        fontWeight: 600,
      },
      medium: {},
      "small-bold": {
        fontSize: "21px",
        lineHeight: "30px",
        fontWeight: 700,
      },
      small: {
        fontSize: "21px",
        lineHeight: "30px",
      },
      "body-bold": {
        fontSize: "18px",
        lineHeight: "28px",
        fontWeight: 700,
      },
      body: {
        fontSize: "18px",
        lineHeight: "28px",
        _light: {
          color: colorConstants.text.body,
        },
        _dark: {
          color: colorConstants.text.body,
        },
      },
      "subtext-bold": {
        fontSize: "14px",
        lineHeight: "21px",
        fontWeight: 700,
        _light: {
          color: colorConstants.text.body,
        },
        _dark: {
          color: colorConstants.text.body,
        },
      },
      subtext: {
        fontSize: "14px",
        lineHeight: "21px",
        _light: {
          color: colorConstants.text.body,
        },
        _dark: {
          color: colorConstants.text.body,
        },
      },
      "body-button": {
        fontSize: "18px",
        lineHeight: "24px",
        _light: {
          color: colorConstants.text.body,
        },
        _dark: {
          color: colorConstants.text.body,
        },
      },
    },
  },
  Input: {
    baseStyle: {
      borderRadius: 5,
      borderColor: colorConstants.textboxborderColour,
      borderWidth: 1,
      backgroundColor: colorConstants.textboxBackgroundColour,
    },
    defaultProps: {
      fontSize: 21,
    },
    variants: {
      primary: {
        backgroundColor: colorConstants.textboxBackgroundColour,
        color: colorConstants.mainTextColour,
        height: "96px",
        width: "full",
      },
    },
  },
};
