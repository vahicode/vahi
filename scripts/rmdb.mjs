import path from 'path'
import fs from 'fs'
import prompts from 'prompts'
import kleur from 'kleur'
import { vascii } from '../api/utils.mjs'
import config from '../vahi.config.mjs'

const rmdb = async () => {
  console.log(`
  ${kleur.green(vascii)}
  🚨 This will ${kleur.yellow('remove your database')}
  ⚠️  There is ${kleur.bold('no way back')} from this - proceed with caution
  `)

  const answer = await prompts([{
    type: 'confirm',
    name: 'confirms',
    message: 'Are you sure you want to completely remove your VaHI database?',
    initial: false
  }])

  if (answer.confirms) {
    console.log()
    // Nuke it from orbit
    const db = path.resolve(config.db.path)
    fs.access(db, fs.constants.W_OK, err => {
      if (err) console.log(`  ⛔  Cannot remove ${kleur.green(db)}  🤔`)
      else {
        fs.unlinkSync(db)
        console.log(`  🔥 Removed ${kleur.red(db)} 😬`)
      }
      console.log()
    }) 
  } else {
    console.log()
    console.log(kleur.green('  😅 Not removing database - Phew'))
    console.log()
  }
}

rmdb()


