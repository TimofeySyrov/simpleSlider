module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "airbnb-typescript/base"
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "linebreak-style": 0,
    "operator-linebreak": 0,
    "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
    "@typescript-eslint/lines-between-class-members": 0,
    "@typescript-eslint/space-before-function-paren": ["error", "always"],
    "object-curly-newline": ["error", {
      "consistent": true
    }],
    "no-trailing-spaces": ["error", {
      "skipBlankLines": true,
      "ignoreComments": true
    }],
  },
  globals: {
    window: true,
    document: true,
    $: true,
  },
};