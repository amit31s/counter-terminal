const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const rules = require("./webpack.rules");
const dotenv = require("dotenv");

dotenv.config();

const webpackEnv = process.env.NODE_ENV || "development";

module.exports = {
  mode: webpackEnv,
  node: {
    __dirname: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      ...rules,
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
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.jsx", ".web.js", ".jsx", ".js"], // read files in fillowing order
    alias: Object.assign({
      "react-native$": "react-native-web",
      "react-native-svg$": "react-native-svg-web",
      "@ct": path.resolve("./src/"),
      "test-utils": path.resolve("./src/common/helpers/test-utils.ts"),
      handlebars: "handlebars/dist/handlebars.js",
    }),
    fallback: { 
      path: require.resolve('path-browserify'), 
      crypto: false, 
      fs: false, 
      http: false, 
      zlib: require.resolve('browserify-zlib'), 
      stream: require.resolve('stream-browserify'), 
      buffer: require.resolve('buffer'),
      jimp: false
    },
  },
};
