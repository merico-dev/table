// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  coverageDirectory: './coverage-u/',
  globalSetup: '<rootDir>/tests/unit/jest.setup.ts',
  testRegex: '(/tests/unit/.*(test|spec|unit))\\.(jsx?|tsx?)$',
  roots: ['<rootDir>/tests/unit/'],
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      tsconfig: 'tests/unit/tsconfig.json',
    },
  },
};
