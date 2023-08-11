module.exports = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  { test: /\.handlebars$/, loader: "handlebars-loader" },
  {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  },
];
