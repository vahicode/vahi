import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req, 'superadmin')
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
