import Prisma from '@prisma/client'
import config from '../vahi.config.mjs'
import { capitalize, generatePassword } from '../api/utils.mjs'
import kleur from 'kleur'
import { vascii } from '../api/utils.mjs'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()

const seed = async () => {
  console.log(`
  ${kleur.green(vascii)}
  🐤  Seeding VaHI database...
  `)
  // Store admin accounts so we can report on them later
  const admins = []
  // Loop over seed config
  for (const type in config.seed) {
    for (const entry of config.seed[type]) {
      if (type === 'admin') {
        // Admin accounts need a password
        const [pwd, hash, salt] = generatePassword()
        console.log(`  ✅  Creating ${kleur.yellow(type)}: ${kleur.green(entry.email)}`)
        await prisma[type].upsert({
          where: {
            email: entry.email
          },
          update: {},
          create: {
            ...entry,
            password: `${hash}:${salt}`,
            createdBy: entry.email,
            isActive: true
          }
        })
        admins.push({ email: entry.email, password: pwd })
      } else {
        console.log(`  ✅  Creating ${kleur.yellow(type)}: ${kleur.green(entry.id)}`)
        await prisma[type].upsert({
          where: { id: entry.id },
          update: {},
          create: entry
        })
      }
    }
  }
  console.log(' ')
  console.log(`  ✨ All done. These admin accounts where created:`)
  for (const admin of admins) {
    console.log(`  
    ${kleur.bold('Username')}: ${kleur.cyan(admin.email)}
    ${kleur.bold('Password')}: ${kleur.cyan(admin.password)}

    `)
  }
  console.log(`  🗒️  Make a note of the ${kleur.cyan('password')} because we won't show it again
    `)

  return 
}

seed()
