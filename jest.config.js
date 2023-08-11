/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
    "^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$": require.resolve(
      "./jest.assetFileTransformer.js",
    ),
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native*|react-native-device-info|@react-navigation|postoffice-html-to-image|postoffice-spm-components|postoffice-receipt-generator|nbit-*)",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFiles: ["./jest.setup-env.js"],
  moduleDirectories: ["src", "node_modules"],
  roots: ["<rootDir>/src"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/assets/",
    "src/openapi",
    "src/api/generator/endpoints",
    "src/utils/Scaling",
    "src/configs",
    "src/common/backendUrl.ts",
  ],
  snapshotSerializers: ["@emotion/jest/serializer"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "./jest.setup.js",
    "./jest.web.setup.js",
  ],
  moduleNameMapper: {
    "@ct/(.*)": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass|gif)$": "identity-obj-proxy",
    "^react-native$": "react-native-web",
    "^react-native-svg$": "react-native-svg-web",
  },
  resolver: "./jest.resolver.js",
  haste: {
    defaultPlatform: "web",
    platforms: ["web"],
  },
  coverageReporters: ["html", ["text", { skipFull: true }], "lcov"],
  coverageProvider: "babel",
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};
