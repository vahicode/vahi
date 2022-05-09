import path from 'path'
import fs from 'fs'
import i18nConfig from './next-i18next.config.js'
import { dbpath } from './vahi.config.mjs'
import { vascii } from './api/utils.mjs'

const config = {
  experimental: {
    externalDir: true,
    topLevelAwait: true,
    outputStandalone: true,
  },
  i18n: i18nConfig.i18n,
  pageExtensions: [ 'js' ],
  reactStrictMode: true,
  webpack: (config, options) => {
    // Aliases
    config.resolve.alias.components = path.resolve('./components/')
    config.resolve.alias.hooks = path.resolve('./hooks/')
    config.resolve.alias.themes = path.resolve('./themes/')
    config.resolve.alias.api = path.resolve('./api/')
    config.resolve.alias.middleware = path.resolve('./middleware/')
    config.resolve.alias.markdown = path.resolve('./markdown/')
    
    return config
  },
}


export default config
