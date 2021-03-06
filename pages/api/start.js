import prisma from 'api/prisma.mjs'
import { generatePassword } from 'api/utils.mjs'
import config from '../../vahi.config.mjs'

const seedDatabase = async () => {

  // Create admin account
  const [pwd, hash, salt] = generatePassword(config.root.password)
  await prisma.Admin.upsert({
    where: {
      email: config.root.email
    },
    update: {},
    create: {
      email: config.root.email,
      createdBy: config.root.email,
      isActive: true,
      notes: 'Superadmin generated by the initial datbase seed script',
      password: `${hash}:${salt}`,
      role: 'superadmin',
    }
  })

  // Create demo user
  await prisma.User.upsert({
    where: { id: 'demo' },
    update: {},
    create: {
      createdBy: config.root.email,
      id: 'demo',
      isActive: true,
      isDemoUser: true,
      notes: 'Demo user generated by teh initial database seed script',
    }
  })

  return { 
    email: config.root.email, 
    password: pwd 
  }
}

const handler = async (req, res) => {

  // Only run this if the database is not initialized already
  let result = false
  try {
    result = await prisma.Admin.findUnique({ 
      where: { email: config.root.email }
    })
    if (!result) {
      // Seed database
      const admin = await seedDatabase()

      return res.status(201).send({ admin })
    }
    else return res.status(409).send({ error: 'Already initilized' })
  }
  catch (err) {

    // Seed database
    const admin = await seedDatabase()

    return res.status(200).send({ admin })
  }
}

export default handler
