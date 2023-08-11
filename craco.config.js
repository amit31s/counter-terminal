const cracoAlias = require("craco-alias");
// const ReactWebConfig = require("react-web-config/lib/ReactWebConfig").ReactWebConfig;
const path = require("path");

const envFilePath = path.resolve(__dirname, ".env");

const appDirectory = __dirname;

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, "src/index.js"),
    path.resolve(appDirectory, "src"),
    path.resolve(appDirectory, "node_modules/react-native-uncompiled"),
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: ["module:metro-react-native-babel-preset"],
      // Re-write paths to import only the modules needed by the app
      plugins: ["react-native-web"],
    },
  },
};

module.exports = {
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        baseUrl: ".",
        source: "tsconfig",
        tsConfigPath: "./tsconfig.base.json",
      },
    },
    // ReactWebConfig(envFilePath),
  ],
  webpack: {
    alias: {
      "react-native": "react-native-web",
      "react-native-svg": "react-native-svg-web",
      react: path.resolve("./node_modules/react"),
      tailwind: "../../product-journey-engine/ui/styles/tailwind.js",
      "react-native-svg": path.resolve("./node_modules/react-native-svg"),
      // "react-native-config": "react-web-config",
      "react-native-camera": "", // Don't resolve react native camera on web
      "react-native-a-beep": "", // Don't resolve react native a beep on web
      "react-native-url-polyfill": "",
      "react-native-barcode-mask": "", // Don't resolve react native camera on
    },

    configure: {
      entry: [path.resolve(appDirectory, "src/index.js")],

      output: {
        filename: "bundle.js",
        path: path.resolve(appDirectory, "build"),
      },

      // plugins: [ReactWebConfig(envFilePath)],

      module: {
        rules: [
          {
            // Needed for React Native for Web implementation of RN's WebView
            test: /postMock.html$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
              },
            },
          },
          babelLoaderConfiguration,
        ],
      },
    },
  },
};
