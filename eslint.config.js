import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: [
    "dist",
    "src/components/tom-roi/backup/**"
  ] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.app.json",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import": importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
          alwaysTryTypes: true
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'import/no-unresolved': 'error',
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "error"
    },
  },
  {
    files: ["supabase/functions/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.deno,
      }
    },
    plugins: {
        "import": importPlugin,
        "@typescript-eslint": tseslint.plugin,
    },
    rules: {
        ...js.configs.recommended.rules,
        ...tseslint.configs.recommended.rules,
        'import/no-unresolved': 'off',
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "no-undef": "error"
    }
  },
  {
    files: ["tailwind.config.ts", "vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    },
    plugins: {
        "@typescript-eslint": tseslint.plugin,
    },
    rules: {
        ...js.configs.recommended.rules,
        ...tseslint.configs.recommended.rules,
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "no-undef": "off"
    }
  }
);
