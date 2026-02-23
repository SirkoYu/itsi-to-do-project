import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Vue flat config — sets up vue-eslint-parser and Vue rules for .vue files
  ...vuePlugin.configs['flat/recommended'],

  // Explicitly restore TypeScript parser for .ts files.
  // Required because flat/recommended sets vue-eslint-parser globally (no files filter),
  // which breaks parsing of plain .ts files.
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
    },
  },

  // For .vue files: delegate <script lang="ts"> blocks to tsParser,
  // add TypeScript rules, and turn off noisy template formatting rules.
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
];
