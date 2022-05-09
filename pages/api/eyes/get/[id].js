import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['dataentry', 'admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Get eyes
  const eye = await prisma.eye.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      createdAt: true,
      createdBy: true,
      isActive: true,
      notes: true,
      Grading: {
        select: { id: true },
      },
      vImg: {
        select: {
          id: true,
          scale: true,
          x: true,
          y: true,
          mimetype: true,
          width: true,
          height: true,
        },
      },
      iImg: {
        select: {
          id: true
        }
      }
    }
  })

  // Replace grading with a count of grades
  eye.grades = eye.Grading.length
  delete eye.Grading

  return res.send(eye)
}

export default handler
