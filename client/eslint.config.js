import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  // eslint-plugin-vue v10 flat config — spreads the full recommended config array
  // (includes vue-eslint-parser setup automatically, no need to import it separately)
  ...vuePlugin.configs['flat/recommended'],
  // TypeScript rules applied on top for both .ts and .vue files
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
];
