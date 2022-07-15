module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: "@babel/eslint-parser",
  extends: [
    "eslint:recommended",
    "google",
    "airbnb-base",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
