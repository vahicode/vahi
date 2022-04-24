import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

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
      eye: true,
    }
  })

  // Keep image out of it
  delete grade.eye.img
  
  return res.send(grade)
}

export default handler
