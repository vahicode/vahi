import config from '../vahi.config.mjs'
const { createHash } = await import('crypto')

export const randomString = len => {
  let rnd = ''
  for (let i=0; i<len; i++) {
    rnd += config.passwords.characters.charAt(Math.floor(Math.random() * config.passwords.characters.length))
  }
  
  return rnd
}

export const generatePassword = () => {
  // Generate random password
  const pwd = randomString(config.passwords.length)
  // Generate random salt
  let salt = randomString(config.passwords.length)
  // Base-64 encode salt to avoid confusion over ':' delimiters
  salt = new Buffer.from(salt).toString('base64')
  // Hash password + salt
  const hasher = createHash(config.passwords.algorithm)
  hasher.update(pwd+salt)
  const hash = hasher.digest('hex')+':'+config.passwords.algorithm

  return [pwd, hash, salt]
}

