const colors = require('tailwindcss/colors')

const bg = '#002808'
module.exports = {
  fontFamily: `ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;`,
  primary: colors.lime['800'],
  'primary-focus': colors.lime['700'],
  'primary-content': colors.neutral['50'],

  secondary: colors.yellow['500'],
  'secondary-focus': colors.yellow['400'],
  'secondary-content': colors.neutral['900'],

  accent: colors.lime['900'],
  'accent-focus': colors.lime['600'],
  'accent-content': colors.neutral['50'],

  neutral: colors.lime['900'],
  'neutral-focus': colors.lime['800'],
  'neutral-content': colors.lime['200'],

  'base-100': bg,
  'base-200': colors.lime['900'],
  'base-300': colors.lime['800'],
  'base-content': colors.lime['500'],

  info: colors.lime['700'],
  success: colors.lime['700'],
  warning: colors.lime['700'],
  error: colors.lime['700'],

  '--btn-info-content': colors.teal[300],
  '--btn-success-content': colors.green[300],
  '--btn-warning-content': colors.orange[300],
  '--btn-error-content': colors.red[300],
  '--rounded-btn': '0',

  '--theme-gradient': `repeating-linear-gradient(
    90deg,
    ${colors.lime[800]} 0,
    ${colors.lime[500]} 50%,
    ${colors.lime[800]} 100%
  )`,
}
