module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: ["eslint:recommended", "standard", "prettier", "plugin:jest/recommended", "plugin:import/recommended"],
  rules: {
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: ["assert"],
      },
    ],
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        alphabetize: { order: "asc" },
      },
    ],
  },
};
