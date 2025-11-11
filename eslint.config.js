import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        module: 'readonly', // Allow `module` to be recognized as global
      },
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript version
      },
    },
  },
  pluginJs.configs.recommended, // Include the recommended config for JavaScript
  ...tseslint.configs.recommended, // Spread the recommended config for TypeScript
  pluginReact.configs.flat.recommended, // Include the recommended config for React
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Disable the rule for React in JSX scope
      '@typescript-eslint/no-require-imports': 'off', // Allow `require()`
      'react/prop-types': 'off',
    },
  },
];
