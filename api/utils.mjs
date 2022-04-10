import config from '../vahi.config.mjs'
import sqlite3 from 'sqlite3'
import path from 'path'
import crypto from 'crypto'

const { createHash } = crypto

// Returns database instance
export const getDb = () => new sqlite3.Database(path.resolve(path.join(config.db.folder, config.db.file)))

// Returns random string of len length
export const randomString = len => {
  let rnd = ''
  for (let i=0; i<len; i++) {
    rnd += config.passwords.characters.charAt(Math.floor(Math.random() * config.passwords.characters.length))
  }
  
  return rnd
}

// Returns an array containing the password, hash, and salt
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

// Capitalize string
export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

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
                     



