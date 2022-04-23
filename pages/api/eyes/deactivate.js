import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that eyes is an array and holds at least one element
  if (!Array.isArray(req.body.eyes) || req.body.eyes.length < 1) return res.status(400)
    .send({ error: 'no_eyes_specified' })  

  // Update eyes
  const promises = []
  for (const id of req.body.eyes) {
    promises.push(await prisma.eye.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    }))
  }

  await Promise.all(promises)

  return res.send({ status: 'ok' })
}

export default handler