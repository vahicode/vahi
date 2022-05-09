import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['dataentry', 'admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Create eye
  const eye = await prisma.eye.create({ 
    data: {
      createdBy: admin.email,
      notes: req.body.notes || ''
    }
  })

  // Update image for vascularisation/haze
  if (req.body.vimg) await prisma.image.update({
    where: { id: parseInt(req.body.vimg) },
    data: { vEyeId: eye.id }
  })

  // Update image for integrity
  if (req.body.iimg) await prisma.image.update({
    where: { id: parseInt(req.body.iimg) },
    data: { iEyeId: eye.id }
  })

  return res.send(eye)
}

export default handler
