const fs = require('fs');
const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember', 'mocha'],
  extends: [
    ...(fs.existsSync('../.eslintrc.yaml') ? ['../.eslintrc.yaml'] : []),
    'plugin:ember/recommended',
    'plugin:i18n-json/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'no-restricted-imports': ['error', { paths: ['lodash'] }],
    'ember/avoid-leaking-state-in-ember-objects': 'off',
    'ember/no-get': ['error'],
    'ember/no-empty-attrs': 'error',
    'ember/no-new-mixins': 'off',
    'ember/no-restricted-resolver-tests': 'off',
    'ember/use-ember-data-rfc-395-imports': 'error',
    'ember/order-in-models': [
      'error',
      {
        order: ['attribute', 'relationship', 'single-line-function', 'multi-line-function'],
      },
    ],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-identical-title': 'error',
    'mocha/no-skipped-tests': 'warn',
    /* Recommended rules */
    'ember/no-mixins': 'off',
    'i18n-json/sorted-keys': [
      'error',
      {
        order: 'asc',
        sortFunctionPath: path.resolve('./config/linter-translation-order.js'),
      },
    ],
    'i18n-json/valid-message-syntax': 'warn',
    'no-irregular-whitespace': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here

        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off',
      }),
    },
    // test files
    {
      files: ['tests/**/*.js'],
      excludedFiles: ['tests/dummy/**/*.js'],
      env: {
        embertest: true,
        mocha: true,
      },
      globals: {
        server: false,
      },
    },
  ],
};
