// See: https://github.com/isaachinman/next-i18next
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'nl'],
    defaultNS: 'vahi',
  },
  interpolation: {
    prefix: '{',
    suffix: '}',
  },
  localeStructure: '{lng}/{ns}',
  namespaces: ['vahi', 'themes'],
}
