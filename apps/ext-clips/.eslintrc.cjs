module.exports = {
  root: false,
  extends: ['plugin:react/recommended', '@repo/config/eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
