import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Get eyes
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      createdBy: true,
      isDemoUser: true,
      isActive: true,
      lastLogin: true,
      notes: true,
      Grading: true
    }
  })
  if (!user) return res.status(404).send()

  // Return only the count of grades
  user.grades = user.Grading.length || 0
  delete user.Grading

  return res.send(user)
}

export default handler
