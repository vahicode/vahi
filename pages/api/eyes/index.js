import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get eyes
  const eyes = await prisma.eye.findMany({
    select: {
      id: true,
      createdAt: true,
      createdBy: true,
      isActive: true,
      notes: true,
      img: false,
      scale: true,
      x: true,
      y: true,
      mimetype: true,
      width: true,
      height: true,
    }
  })

  return res.send(eyes)
}

export default handler
