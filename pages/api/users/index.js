import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get users
  const users = await prisma.user.findMany({ 
    include: { 
      Grading: true
    }
  })

  // Only keep a count of graded eyes
  for (const user of users) {
    user.graded = user.Grading.length
    delete user.Grading
  }

  return res.send(users)
}

export default handler
