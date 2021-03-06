import prisma from 'api/prisma.mjs'
import { generatePassword, authenticate } from 'api/utils.mjs'
import config from '../../../vahi.config.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, 'superadmin')
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
    update: {
      password: `${hash}:${salt}`,
    },
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
