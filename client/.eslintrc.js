module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: '@babel/eslint-parser',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-tabs': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'no-underscore-dangle': 'off',
    'no-mixed-operators': 'off',
    'no-return-assign': 'off',
    'no-empty-pattern': 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],

  plugins: [],
};
