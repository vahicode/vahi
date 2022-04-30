import { prisma, authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get users
  const admins = await prisma.admin.findMany()

  // Keep passwords out of it
  for (const admin of admins) delete admin.password

  return res.send(admins)
}

export default handler
