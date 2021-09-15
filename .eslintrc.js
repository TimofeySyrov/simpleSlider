module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'airbnb-typescript/base'
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    "linebreak-style": 0,
    "@typescript-eslint/space-before-function-paren": ["error", "always"],
    "@typescript-eslint/lines-between-class-members": "off",
    "no-trailing-spaces": "off",
    "semi": "off",
    "@typescript-eslint/semi": "off",
    "eol-last": "off",
    "quotes": "off",
    "@typescript-eslint/quotes": "off",
    "padded-blocks": "off"
  },
  globals: {
    window: true,
    document: true
  }
};