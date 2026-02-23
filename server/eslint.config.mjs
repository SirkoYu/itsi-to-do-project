import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['build/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-console': 'off',
      // Allow _-prefixed args to mark intentionally unused parameters (e.g. Express middleware)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Allow "declare global { namespace }" — required for augmenting third-party types (Express)
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
];
