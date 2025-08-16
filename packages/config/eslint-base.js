module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    node: true,
    jest: true
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.base.json'
  }
};
