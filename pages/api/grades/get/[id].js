import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Get grades
  const grade = await prisma.grading.findUnique({
    where: { id: parseInt(id) },
    include: { 

      user: true,
      eye: {
        include: {
          vImg: true,
          iImg: true,
        }
      }
    }
  })

  // Keep images out of it
  delete grade.eye.vImg.img
  delete grade.eye.iImg.img
  
  return res.send(grade)
}

export default handler
