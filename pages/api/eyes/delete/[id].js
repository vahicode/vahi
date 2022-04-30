import { prisma, authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Remove eye
  const eye = await prisma.eye.delete({
    where: { id: parseInt(id) },
  })

  return res.send({ removed: id })
}

export default handler
