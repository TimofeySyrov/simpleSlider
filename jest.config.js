/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  modulePaths: [
    "<rootDir>/src"
  ],
  moduleDirectories: [
    "src",
    "node_modules"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}"
  ],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest"
  }
};