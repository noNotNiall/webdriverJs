import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import promisePlugin from "eslint-plugin-promise";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Path to your tsconfig.json file
      },
    },
    plugins: {
      promise: promisePlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
    },
  },
];