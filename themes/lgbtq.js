const colors = require('tailwindcss/colors')

module.exports = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',

  'base-100': colors.neutral['50'],
  'base-200': colors.neutral['200'],
  'base-300': colors.neutral['400'],
  'base-content': colors.neutral['700'],

  primary: colors.yellow['400'],
  'primary-focus': colors.yellow['500'],
  'primary-content': colors.yellow['900'],
  secondary: colors.violet['500'],
  'secondary-focus': colors.violet['400'],
  'secondary-content': colors.violet['50'],

  accent: colors.green['500'],
  'accent-focus': colors.green['600'],
  'accent-content': colors.green['900'],

  neutral: colors.violet['900'],
  'neutral-focus': colors.violet['600'],
  'neutral-content': colors.violet['200'],

  info: colors.pink['400'],
  success: colors.green['600'],
  warning: colors.amber['500'],
  error: colors.red['600'],

  '--theme-gradient': `repeating-linear-gradient(
   90deg,
   ${colors.red[500]},
   ${colors.red[500]} 16.66%,
   ${colors.orange[500]} 16.66%,
   ${colors.orange[500]} 33.33%,
   ${colors.yellow[400]} 33.33%,
   ${colors.yellow[400]} 50%,
   ${colors.green[500]} 50%,
   ${colors.green[500]} 66.66%,
   ${colors.blue[500]} 66.66%,
   ${colors.blue[500]} 83.33%,
   ${colors.violet[500]} 83.33%,
   ${colors.violet[500]} 100%
 )`,
}
