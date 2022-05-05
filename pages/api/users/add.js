import prisma from 'api/prisma.mjs'
import { authenticate, generateInvite } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that count is numeric and not higher than 100
  if (typeof req.body.count !== 'number') return res.status(400)
    .send({ error: 'count_must_be_numeric' })  
  if (req.body.count > 100) req.body.count = 100

  // Create users
  const users = []
  const promises = []
  for (let i=0;i<req.body.count;i++) {
    const invite = generateInvite()
    users.push(invite)
    promises.push(await prisma.user.create({
      data: {
        id: invite,
        createdBy: admin.email,
        isDemoUser: false,
        isActive: true,
        notes: req.body.notes
      }
    }))
  }

  await Promise.all(promises)

  return res.send(users)
}

export default handler
