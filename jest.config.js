/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  coverageDirectory: "<rootDir>/coverage/",
  modulePaths: [
    "<rootDir>/src"
  ],
  moduleDirectories: [
    "src",
    "node_modules"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/slider/**/*.ts",
    "!src/slider/utils/interfaces/IJQuerySlider.d.ts",
    "!src/slider/index.ts",
    "!src/slider/simpleSlider.ts",
  ],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.hbs$": "<rootDir>/node_modules/handlebars-jest",
  },
  testPathIgnorePatterns: [
    "src/demo/",
  ]
};