import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that users is an array and holds at least one element
  if (!Array.isArray(req.body.users) || req.body.users.length < 1) return res.status(400)
    .send({ error: 'no_users_specified' })  

  // Update users
  const promises = []
  for (const id of req.body.users) {
    promises.push(await prisma.user.update({
      where: { id },
      data: { isActive: false }
    }))
  }

  await Promise.all(promises)

  return res.send({ status: 'ok' })
}

export default handler
