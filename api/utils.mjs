import config from '../vahi.config.mjs'
import path from 'path'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import fs from 'fs'

const { createHash } = crypto

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

// Returns random string of len length
export const randomString = (len, set='passwords') => {
  let rnd = ''
  for (let i=0; i<len; i++) {
    rnd += config[set].characters.charAt(Math.floor(Math.random() * config[set].characters.length))
  }
  
  return rnd
}

// Returns a random invite
export const generateInvite = () => randomString(config.invites.length, 'invites')

// Returns an array containing the password, hash, and salt
export const generatePassword = (password=false) => {
  // Generate random password
  const pwd = password
    ? password
    : randomString(config.passwords.length)
  // Generate random salt
  const salt = randomString(config.passwords.length)
  // Base-64 encode salt to avoid confusion over ':' delimiters
  const salt64 = new Buffer.from(salt).toString('base64')
  // Hash password + salt
  const hasher = createHash(config.passwords.algorithm)
  hasher.update(pwd+salt)
  const hash = hasher.digest('hex')+':'+config.passwords.algorithm

  return [pwd, hash, salt64]
}

export const checkPassword = (pwd, hash, salt64) => {
  const salt = new Buffer.from(salt64, 'base64').toString()
  // Hash password + salt
  const hasher = createHash(config.passwords.algorithm)
  hasher.update(pwd+salt)
  
  return (hasher.digest('hex') === hash)
}

// Silly ascii art
export const vascii = `

  ╔══════════════════════════════════════════╗
  ║     __   __    _  _ ___                  ║
  ║     \\ \\ / /_ _| || |_ _|                 ║
  ║      \\ V / _\` | __ || |                  ║
  ║       \\_/\\__,_|_||_|___|                 ║
  ║       A standardized grading system      ║
  ║       for limbal stem cell deficiency    ║
  ║                                          ║
  ╚══════════════════════════════════════════╝ 
`
                     
// Returns a JSON Web Token
export const getJWT = data => jwt.sign(
  {
    aud: config.jwt.audience,
    iss: config.jwt.issuer,
    ...data,
  },
  config.jwt.secret,
  {
    expiresIn: config.jwt.expiresIn
  },
)

// Authenticates based on JWT token
export const authenticate = {
  admin: (req, role=false) => {
    const admin = jwt.verify(req.headers.authorization.slice(7), config.jwt.secret)
    if (role && admin) {
      if (Array.isArray(role)) {
        if (role.indexOf(admin.role) === -1) return false
      } else {
        if (admin.role !== role) return false
      }
    }

    return admin
  },
  user: (req) => jwt.verify(req.headers.authorization.slice(7), config.jwt.secret)
}

export const dbFileIsPresent = () => {
  try {
    if (fs.existsSync(path.resolve(config.db.path))) return true
    else return false
  } catch (err) {
    return false
  }
}


