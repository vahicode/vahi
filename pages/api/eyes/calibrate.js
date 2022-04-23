import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that eye and x,y,scale is set
  if (!req.body.eye 
    || !req.body.x
    || !req.body.y
    || !req.body.scale) return res.status(400)
    .send({ error: 'no_eye_specified' })  

  // Update eye
  const eye = await prisma.eye.update({
    where: { id: parseInt(req.body.eye) },
    data: { 
      x: parseFloat(req.body.x),
      y: parseFloat(req.body.y),
      scale: parseFloat(req.body.scale)
    }
  })

  return res.send(eye)
}

export default handler