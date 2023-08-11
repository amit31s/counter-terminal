let path = require("path");
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ts", ".tsx", ".js", ".jsx", "index.tsx", "index.ts"],
        alias: {
          tailwind: "../../product-journey-engine/ui/styles/tailwind.js",
          "^@ct/(.+)": "./src/\\1",
        },
      },
    ],
  ],
};
