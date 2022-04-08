const colors = require('tailwindcss/colors')

const blue = '#77cbf9'
const pink = '#ecadb9'

module.exports = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',

  'base-100': colors.neutral['100'],
  'base-200': colors.neutral['200'],
  'base-300': colors.neutral['400'],
  'base-content': colors.neutral['700'],

  primary: pink,
  'primary-focus': blue,
  'primary-content': colors.neutral['900'],
  secondary: colors.pink['400'],
  'secondary-focus': pink,
  'secondary-content': colors.neutral['900'],

  accent: colors.neutral['300'],
  'accent-focus': colors.neutral['900'],
  'accent-content': colors.neutral['900'],

  neutral: colors.neutral['400'],
  'neutral-focus': colors.neutral['500'],
  'neutral-content': colors.neutral['900'],

  info: colors.pink['400'],
  success: colors.green['600'],
  warning: colors.amber['500'],
  error: colors.red['600'],

  '--theme-gradient': `repeating-linear-gradient(
    -45deg,
    #77cbf9,
    #77cbf9 20px,
    #ecadb9 20px,
    #ecadb9 40px,
    ${colors.neutral['50']} 40px,
    ${colors.neutral['50']} 60px,
    #ecadb9 60px,
    #ecadb9 80px,
    #77cbf9 80px,
    #77cbf9 100px
  )`,

  '--theme-gradient': `repeating-linear-gradient(
    90deg,
    #77cbf9,
    #77cbf9 20%,
    #ecadb9 20%,
    #ecadb9 40%,
    ${colors.neutral['50']} 40%,
    ${colors.neutral['50']} 60%,
    #ecadb9 60%,
    #ecadb9 80%,
    #77cbf9 80%,
    #77cbf9 100%
 )`,
}
