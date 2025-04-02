import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "plugin:@typescript-eslint/recommended"
  ),
  ...compat.config({
    extends: ["next"],
    rules: {
      "@typescript-eslint/no-unused-vars":  "off",
      "@typescript-eslint/ban-ts-comment":  "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "react/jsx-no-undef":                 "error",
      "react-hooks/rules-of-hooks":         "error",
      "react-hooks/exhaustive-deps":        "warn"
    }
  })
];

export default eslintConfig;
