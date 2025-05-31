import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

const ALLOW_UNUSED_VARNAME_PATTERN = "^_";

export default defineConfig([
  globalIgnores(["**/*.js"]),
  {
    files: [
      "packages/**/*.ts",
      "types/**/*.ts",
      "examples/**/*.ts",
      "config/**/*.ts",
    ],
    plugins: {
      js,
      import: importPlugin,
    },
    extends: ["js/recommended"],
  },
  {
    files: [
      "packages/**/*.ts",
      "types/**/*.ts",
      "examples/**/*.ts",
      "config/**/*.ts",
    ],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: [
      "packages/**/*.ts",
      "types/**/*.ts",
      "examples/**/*.ts",
      "config/**/*.ts",
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "no-empty": "warn",
      "@typescript-eslint/no-extra-semi": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
          argsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
          destructuredArrayIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
          caughtErrorsIgnorePattern: ALLOW_UNUSED_VARNAME_PATTERN,
        },
      ],
      eqeqeq: "error",
      "no-case-declarations": "off",
      "no-console": "warn",
      "prefer-const": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            {
              pattern: "@/**",
              group: "external",
              position: "after",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.d.ts"],
    overrides: {
      rules: {
        "@typescript-eslint/no-var": "off",
      },
    },
  },
]);
