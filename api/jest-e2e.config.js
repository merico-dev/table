// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  coverageDirectory: './coverage-e2e/',
  globalSetup: '<rootDir>/tests/e2e/jest.setup.ts',
  testRegex: '(/tests/e2e/.*(test|spec|e2e))\\.(jsx?|tsx?)$',
  roots: ['<rootDir>/tests/e2e/'],
  testSequencer: './test.sequencer.js',
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      tsconfig: 'tests/e2e/tsconfig.json',
    },
  },
};
