import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { commonRules } from './eslint.common-rules.mjs';

export default [
  pluginJs.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: false,
    braceStyle: '1tbs',
    commaDangle: 'never'
  }),
  {
    languageOptions: {
      ecmaVersion: 2018,
      globals: {
        ...globals.node
      }
    },
    ...commonRules
  }
];
