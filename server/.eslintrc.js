module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-tabs': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-mixed-operators': 'off',
    'no-return-assign': 'off',
  },
  ignorePatterns: [],
  root: true,
};
