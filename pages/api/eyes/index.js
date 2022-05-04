import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const imgFields = { 
  select: { 
    id: true,
    scale: true,
    x: true,
    y: true,
    width: true,
    height: true,
  } 
}

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
  for (const eye of eyes) {
    eye.grades = eye.Grading.length
    delete eye.Grading
  }

  return res.send(eyes)
}

export default handler

