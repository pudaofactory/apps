const baseConfig = require('@repo/config/tailwind')

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ]
}
