module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'mocha',
    'prettier',
    '@typescript-eslint',
    'chai-expect',
    'chai-friendly',
    'promise'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:chai-expect/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:mocha/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-nested-ternary': 2,
    '@typescript-eslint/unbound-method': 'off'
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    es6: true,
    node: true
  }
};
