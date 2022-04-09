import config from '../vahi.config.mjs'
import sqlite3 from 'sqlite3'
import path from 'path'
import { generatePassword } from './utils.mjs'

const init = () => {
  // Create database
  const db = new sqlite3.Database(path.resolve(path.join(config.db.folder, config.db.file)))
  // Check if database exists
  let exists = false
  db.exec('SELECT * FROM admins;', err => {
    if (!err) console.log(`
  VaHI: WARNING - Database does already exist. 
  Remove it if you want to initialize a new database
      `)
    else {
      const queries = []
      // Generate CREATE TABLE queries based on schema
      for (const table in config.db.schema) {
        // Take out foreign key definitions so we're left with only fields
        const foreign_keys = config.db.schema[table].foreign_keys
          ? config.db.schema[table].foreign_keys
          : false
        if (foreign_keys) delete config.db.schema[table].foreign_keys
        // Now iterate over the fields to create the query
        let query = ` CREATE TABLE ${table} (`
        for (const [field, statements] of Object.entries(config.db.schema[table])) {
          query += `${field} ${statements.join(' ')},`
        }
        // Finally add foreign keys if there are any
        if (foreign_keys) {
          for (const field in foreign_keys) {
            const [table, key] = foreign_keys[field]
            query += ` FOREIGN KEY (${field}) REFERENCES ${table} (${key}) ON DELETE CASCADE ON UPDATE NO ACTION,`
          }
        }
        // Remove trailing comma and close brackets
        queries.push(query.slice(0, -1)+');')
      }
      // Run CREATE TABLE queries to, you know, create tables
      db.exec(queries.join(' '), err => {
        if (err) console.log(`WARNING: Failed to create database tables. The error was:`, err)
        else {
          console.log(`VaHI: Created database tables`)
          // Create roles user
          db.exec(`INSERT INTO roles ( id, description ) VALUES
            ( 'superadmin', 'Super Administrators can do anything, including managing other admins'),
            ( 'admin', 'Administrators can do everything except adding/removing other admins'),
            ( 'researcher', 'Researchers can see/export data, but cannot make any changes');
          `, err => {
            if (err) console.log(`WARNING: Failed to create admin roles. The error was:`, err)
            else console.log(`VaHI: Created admin roles`)
          })
          // Create admin user
          const [pwd, hash, salt] = generatePassword()
          db.exec(`INSERT INTO admins 
            ( email, role, active, notes, password )
            VALUES( "${config.rootadmin}", "superadmin", 1, "VaHI root admin created by init script", "${pwd}:${hash}:${salt}")
          `, err => {
            if (err) console.log(`WARNING: Failed to create root admin user. The error was:`, err)
            else {
              console.log(`VaHI: Created root admin`)
              if (pwd) {
                console.log(`VaHI: All done

        You can now login with the root admin account:

          username: root@vahi.eu
          password: ${pwd}

        Please write this password down. 
        You can restore it by running 'npm run rootpasswordreset'
                `)
              }
            }
          })
          // Create demo user
          db.exec(`INSERT INTO users 
            ( by, invite, active, notes, demo )
            VALUES( "${config.rootadmin}", "vahi", 1, "VaHI demo user created by init script", 1)
          `, err => {
            if (err) console.log(`WARNING: Failed to create demo user. The error was:`, err)
            else console.log(`VaHI: Created demo user`)
          })
        }
      })
    }
  })
}

init()

