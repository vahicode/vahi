import config from '../vahi.config.mjs'
import sqlite3 from 'sqlite3'
import path from 'path'
import { generatePassword } from './utils.mjs'

const reset = () => {
  // Connect to database
  const db = new sqlite3.Database(path.resolve(path.join(config.db.folder, config.db.file)))
  // Check if database exists
  let exists = false
  db.exec('SELECT * FROM admins;', err => {
    if (err) console.log(`
  VaHI: WARNING - Database does not exist. 
  You can create it by running: npm run initdb 
  ( or: yarn initdb )
      `)
    else {
      // Update admin user
      const [pwd, hash, salt] = generatePassword()
      db.exec(`UPDATE admins SET password = "${pwd}:${hash}:${salt}" WHERE email = "${config.rootadmin}";`, err => {
        if (err) console.log(`WARNING: Failed to update root admin user password. The error was:`, err)
        else console.log(`VaHI: Root admin password reset

    You can now login with the root admin account:

      username: root@vahi.eu
      password: ${pwd}

    Please write this password down. 
    You can restore it by running 'npm run rootpasswordreset'
        `)
      })
    }
  })
}

reset()

