const colors = require('tailwindcss/colors')

module.exports = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  primary: colors.emerald['900'],
  'primary-focus': colors.emerald['800'],
  'primary-content': colors.neutral['50'],

  secondary: colors.sky['500'],
  'secondary-focus': colors.sky['400'],
  'secondary-content': colors.sky['900'],

  accent: colors.pink['900'],
  'accent-focus': colors.pink['700'],
  'accent-content': colors.neutral['50'],

  neutral: colors.neutral['700'],
  'neutral-focus': colors.neutral['800'],
  'neutral-content': colors.neutral['300'],

  'base-100': colors.neutral['800'],
  'base-200': colors.neutral['700'],
  'base-300': colors.neutral['600'],
  'base-content': colors.neutral['300'],

  info: colors.indigo['700'],
  success: colors.green['700'],
  warning: colors.orange['500'],
  error: colors.red['700'],

  '--btn-info-content': colors.neutral[50],
  '--btn-success-content': colors.neutral[50],
  '--btn-warning-content': colors.neutral[50],
  '--btn-error-content': colors.neutral[50],

  '--theme-gradient': `repeating-linear-gradient(
    90deg,
    ${colors.emerald[800]} 0,
    ${colors.emerald[700]} 15%,
    ${colors.pink[700]} 40%,
    ${colors.indigo[600]} 70%,
    ${colors.emerald[800]} 100%
  )`,
}
