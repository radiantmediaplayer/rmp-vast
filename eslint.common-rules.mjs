export const commonRules = {
  rules: {
    // @stylistic
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/operator-linebreak': ['error', 'after'],
    '@stylistic/padded-blocks': 'off',
    '@stylistic/no-trailing-spaces': 'off',
    '@stylistic/comma-dangle': 'off',
    '@stylistic/spaced-comment': 'off',
    '@stylistic/indent-binary-ops': 'off',
    '@stylistic/arrow-parens': 'off',
    '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    '@stylistic/dot-location': ['error', 'object'],
    '@stylistic/eol-last': ['error', 'always'],
    // Possible Problems
    'array-callback-return': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'error',
    'no-inner-declarations': 'error',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-use-before-define': 'error',
    'require-atomic-updates': 'error',
    // Suggestions 
    'accessor-pairs': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'error',
    'class-methods-use-this': 'error',
    'consistent-this': 'error',
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'require-await': 'error'
  }
};