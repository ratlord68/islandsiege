const { createDefaultPreset } = require('ts-jest')

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['/__mocks__/'],
  testPathIgnorePatterns: ['/node_modules/'],
}
