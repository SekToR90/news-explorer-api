module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-unused-vars': ['error', {
      vars: 'all', args: 'after-used', argsIgnorePattern: 'next|res', ignoreRestSiblings: false,
    }],
    'no-console': 'off',
  },
};
