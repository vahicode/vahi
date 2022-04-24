import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get grades/gradings
  const grades = await prisma.grading.findMany({ 
    include: { 
      user: true,
      eye: true,
    }
  })

  // Only keep some info of included user/eye
  for (const grade of grades) {
    grade.user = grade.user.id
    grade.eye = grade.eye.id
  }

  return res.send(grades)
}

export default handler
