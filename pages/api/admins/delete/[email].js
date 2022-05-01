import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, 'superadmin')
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { email } = req.query

  // Remove eye
  const result = await prisma.admin.delete({
    where: { email },
  })

  return res.send({ removed: email })
}

export default handler
