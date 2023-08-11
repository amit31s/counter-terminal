// https://github.com/facebook/react-native/blob/v0.71.8/jest/assetFileTransformer.js
// Use the new version so we can keep RN68 for now whilst updating to jest 28

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

"use strict";

/* eslint-env node */

const path = require("path");
const createCacheKeyFunction = require("@jest/create-cache-key-function").default;

module.exports = {
  // Mocks asset requires to return the filename. Makes it possible to test that
  // the correct images are loaded for components. Essentially
  // require('img1.png') becomes `Object { "testUri": 'path/to/img1.png' }` in
  // the Jest snapshot.
  process: (_, filename) => ({
    code: `module.exports = {
      testUri:
        ${JSON.stringify(path.relative(__dirname, filename).replace(/\\/g, "/"))}
    };`,
  }),
  getCacheKey: createCacheKeyFunction([__filename]),
};
