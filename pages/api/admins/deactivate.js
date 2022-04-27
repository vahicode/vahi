import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that admins is an array and holds at least one element
  if (!Array.isArray(req.body.admins) || req.body.admins.length < 1) return res.status(400)
    .send({ error: 'no_admins_specified' })  


  // Update admins
  let danger = false
  const removed = []
  const promises = []
  for (const email of req.body.admins) {
    if (email.toLowerCase() !== admin.email.toLowerCase()) {
      promises.push(
        await prisma.admin.update({
          where: { email },
          data: { isActive: false }
        })
      ) 
      removed.push(email.toLowerCase())
    }
    else danger = true
  }

  await Promise.all(promises)

  return res.send({ status: 'ok', removed, danger })
}

export default handler
