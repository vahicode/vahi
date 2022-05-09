import path from 'path'
import fs from 'fs'
import kleur from 'kleur'
import { dbpath } from '../vahi.config.mjs'
import { vascii } from '../api/utils.mjs'

/*
 * This is a bit hackish, but there is no obvious way
 * to run something only when NextJS is bootstrapping.
 * See: https://github.com/vercel/next.js/discussions/15341
 */
const startup = () => {
  console.log(`${kleur.green(vascii)}`)
  const db = path.resolve(dbpath)
  const schema = path.resolve('./prisma/schema.db')
  try {
    if (fs.existsSync(db)) {
      console.log(`VaHI: ⛔  Database detected - Not proceeding`)
      console.log(`VaHI: If you want to create a new database, remove this file: ${kleur.cyan(db)}`)
    }
    else {
      console.log(`VaHI: 🚨 Going to create a database at ${kleur.cyan(db)}`)
      fs.copyFile(schema, db, err => {
        if (err) console.log(`VaHI: ⚠️  ${kleur.red(ERROR)}: Unable to create database file`, err)
        else {
          console.log(`VaHI: ${kleur.green('Database created')}`)
        }
      })
    }
  } catch(err) {
    console.log(`VaHI: ERROR: Unable to detect database file at ${db}`, err)
  }
}

startup()

