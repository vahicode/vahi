import { prisma, authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Get eyes
  const user = await prisma.user.findUnique({
    where: { id }
  })

  return res.send(user)
}

export default handler
