import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req, ['dataentry', 'admin', 'superadmin'])
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
      data: { isActive: true }
    }))
  }

  await Promise.all(promises)

  return res.send({ status: 'ok' })
}

export default handler
