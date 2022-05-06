import config from '../../../vahi.config.mjs'
import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const exportpath = config.db.path+'_export.db'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get gradings
  const grades = await prisma.grading.findMany()
  for (const grade of grades) grade.userId = grade.userId.slice(0,6)+'...'

  return res.send(grades)
}

export default handler
