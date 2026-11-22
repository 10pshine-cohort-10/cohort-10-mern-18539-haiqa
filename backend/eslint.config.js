import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'coverage/**', 'logs/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['src/tests/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.mocha } },
  },
];
