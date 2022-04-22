import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, 'superadmin')
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { email } = req.query

  // Get admin
  const record = await prisma.admin.findUnique({
    where: { email },
    select: {
      email: true,
      createdAt: true,
      createdBy: true,
      isActive: true,
      notes: true,
      role: true,
      lastLogin: true,
    }
  })

  return res.send(record)
}

export default handler
