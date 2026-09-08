import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      playwright,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...playwright.configs["flat/recommended"].rules,
      // TypeScript already resolves identifiers; no-undef only produces false
      // positives on ambient Node globals here.
      "no-undef": "off",
      "playwright/no-conditional-in-test": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  prettier,
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "reports/**",
      "allure-results/**",
      "allure-report/**",
    ],
  },
];
