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
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // TypeScript already resolves identifiers; no-undef only produces false
      // positives on ambient Node globals here.
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Spec files only. Page objects legitimately use APIs that are
    // anti-patterns inside a test, such as scoping with first().
    files: ["tests/**/*.ts", "vr-tests/**/*.ts"],
    plugins: { playwright },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // These four encode rules from
      // .claude/skills/playwright-pageobject-testing/SKILL.md so the standard
      // fails the pipeline instead of relying on a reviewer noticing.
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-skipped-test": "error",
      "playwright/no-force-option": "error",
      "playwright/expect-expect": "error",
      "playwright/no-conditional-in-test": "off",
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
