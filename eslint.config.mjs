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
    ignores: [
      'src/assets/*',
      'test/lib/*',
      'test/spec/main/*',
      'test/spec/helpers/*',
      'test/*.mjs',
      'babel.config.js',
      'webpack.dev.config.js',
      'webpack.production.config.js'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.jasmine,
        RMP_VAST_VERSION: 'readonly',
        RmpVast: 'readonly',
        OmidSessionClient: 'readonly',
        Hls: 'readonly',
        SimidPlayer: 'readonly',
        SimidProtocol: 'readonly'
      }
    },
    ...commonRules
  }
];
