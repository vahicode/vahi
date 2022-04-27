import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Remove user
  const user = await prisma.user.delete({
    where: { id },
  })

  return res.send({ removed: id })
}

export default handler
