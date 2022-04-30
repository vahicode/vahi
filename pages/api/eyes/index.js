import { prisma, authenticate } from 'api/utils.mjs'

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
      img: false,
      scale: true,
      x: true,
      y: true,
      mimetype: true,
      width: true,
      height: true,
      Grading: true
    }
  })

  // Only keep a count of graded eyes
  for (const eye of eyes) {
    eye.graded = eye.Grading.length
    delete eye.Grading
  }

  return res.send(eyes)
}

export default handler
