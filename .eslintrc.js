module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "indent": ["error", 2],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "off",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  ignorePatterns: [
    "node_modules/",
    "public/",
    "dist/",
    "build/",
    "*.min.js"
  ]
}; 