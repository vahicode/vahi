import { PrismaClient } from '@prisma/client'
import { generatePassword, authenticate } from 'api/utils.mjs'
import config from '../../../vahi.config.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })
  if (admin.role !== 'superadmin') return res.status(403)
    .send({ error: 'required_role_missing' })

  // Check that count is numeric and not higher than 100
  if (!req.body.email) return res.status(400)
    .send({ error: 'email_is_required' })  

  // Create admin
    const [pwd, hash, salt] = generatePassword()
    const record = await prisma.admin.upsert({
      where: { email: req.body.email },
      update: {},
      create: {
        email: req.body.email,
        notes: req.body?.notes || '',
        isActive: false,
        password: `${hash}:${salt}`,
        createdBy: admin.email
      }
    })

  return res.send({...record, password: pwd})
}

export default handler
