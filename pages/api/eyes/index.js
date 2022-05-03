import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const onlyId = { select: { id: true } }

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['dataentry', 'admin', 'superadmin'])
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
      vImg: onlyId,
      iImg: onlyId,
      Grading: true
    }
  })

  // Only keep a count of graded eyes, an move ID so it's a scalar
  for (const eye of eyes) {
    eye.graded = eye.Grading.length
    delete eye.Grading
    if (eye.vimg?.id) eye.vimg = eye.vimg.id
    if (eye.iimg?.id) eye.iimg = eye.iimg.id
  }

  return res.send(eyes)
}

export default handler

