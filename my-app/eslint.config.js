import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  // Add this block for Jest globals in test files:
  { files: ["**/*.test.{js,jsx}"], languageOptions: { globals: { ...globals.jest } } },
  pluginReact.configs.flat.recommended,
]);