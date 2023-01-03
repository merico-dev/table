// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  coverageDirectory: './coverage-i/',
  globalSetup: '<rootDir>/tests/integration/jest.setup.ts',
  testRegex: '(/tests/integration/.*(test|spec|integration))\\.(jsx?|tsx?)$',
  roots: ['<rootDir>/tests/integration/'],
  testSequencer: './test.sequencer.js',
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      tsconfig: 'tests/integration/tsconfig.json',
    },
  },
};
