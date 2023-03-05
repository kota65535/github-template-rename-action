module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "standard",
    "prettier",
    "plugin:jest/recommended",
  ],
  rules: {
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: ["assert"],
      },
    ],
  },
};
