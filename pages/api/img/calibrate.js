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

  // Check that eye and x,y,scale is set
  if (!req.body.image 
    || !req.body.x
    || !req.body.y
    || !req.body.scale) return res.status(400)
    .send({ error: 'no_eye_specified' })  

  // Update image
  const image = await prisma.image.update({
    where: { id: parseInt(req.body.image) },
    data: { 
      x: parseFloat(req.body.x),
      y: parseFloat(req.body.y),
      scale: parseFloat(req.body.scale)
    }
  })

  return res.send(image)
}

export default handler
