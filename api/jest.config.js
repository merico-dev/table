module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest'],
  },
  testTimeout: 15000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageReporters: ['text', 'text-summary', 'lcov', 'json'],
  clearMocks: true,
  bail: 1,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/tests/'],
  cacheDirectory: '<rootDir>/.jest_cache',
  globalTeardown: './test-teardown-globals.js',
};
