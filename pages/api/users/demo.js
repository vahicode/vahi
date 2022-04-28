import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that user and demo is present
  if (!req.body.user || typeof req.body.demo === 'undefined') return res.status(400)
    .send({ error: 'no_user_specified' })  

  // Update eye
  const user = await prisma.user.update({
    where: { id: req.body.user },
    data: { isDemoUser: req.body.demo }
  })
  
  return res.send(user)
}

export default handler
