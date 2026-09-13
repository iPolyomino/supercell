const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const nextVitals = require('eslint-config-next/core-web-vitals');
const globals = require('globals');

module.exports = tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '**/.next/**', '.firebase/**', '**/next-env.d.ts'] },
  { ...js.configs.recommended, files: ['**/*.{js,cjs,ts,tsx}'] },
  ...nextVitals.map(config => ({ ...config, files: ['src/app/**/*.{js,ts,tsx}'] })),
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      // Firebase's SDK overloads expose loosely typed app/database parameters.
      '@typescript-eslint/no-unsafe-argument': 'off'
      , '@typescript-eslint/no-unsafe-assignment': 'off'
    }
  },
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: { globals: globals.node }
  },
  {
    files: ['src/app/**/*.{js,ts,tsx}'],
    settings: { next: { rootDir: 'src/app/' } }
  }
);
