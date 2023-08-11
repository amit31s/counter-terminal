const weightNumberToName = {
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
} as const;

const generateFontNames = (weight: keyof typeof weightNumberToName) => {
  return {
    normal: `"Nunito Sans"; font-style: normal; font-weight: ${weight}`,
    italic: `"Nunito Sans"; font-style: italic; font-weight: ${weight}`,
  };
};

const weights = Object.fromEntries(
  ([200, 300, 400, 600, 700, 800, 900] as const).map((weight) => [
    weight,
    generateFontNames(weight),
  ]),
);

export const fontConfig = {
  NunitoSans: {
    ...weights,
  },
};

export const fonts = {
  heading: "NunitoSans",
  body: "NunitoSans",
};
