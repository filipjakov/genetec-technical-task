import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const demoFiles = ['apps/demo/**/*.{js,jsx,mjs,ts,tsx}'];

const scope = (files, configs) =>
  configs.map((config) => ({ ...config, files }));

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/.next/',
    '**/next-env.d.ts',
    '.scratch/',
    '.claude/',
    '.agents/',
  ]),
  {
    files: ['*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  ...scope(demoFiles, [...nextCoreWebVitals, ...nextTypescript]),
  {
    files: demoFiles,
    settings: { next: { rootDir: 'apps/demo' } },
  },
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: { globals: globals.browser },
  },
]);
