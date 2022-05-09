import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['dataentry', 'admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get ID from dynamic route
  const { id } = req.query

  // Remove eye
  let eye
  try {
    eye = await prisma.eye.delete({
      where: { id: parseInt(id) },
    })
  } 
  catch (err) {
    // Can't remove an eye with active ratings
    if (err.code === 'P2003') return res.status(403).send({error: 'Cannot remove an eye with gradings' })
    else res.status(500).send()
  }

  return res.send({ removed: id })
}

export default handler
