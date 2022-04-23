import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // User authentication
  const user = authenticate.user(req)
  if (!user) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Is this user active?
  if (!user.isActive) return res.status(403)
    .send({ error: 'invite_inactive' })

  // Get all active eyes
  const eyes = Object.fromEntries(
    (await prisma.eye.findMany({ 
      where: { isActive: true },
      select: {
        id: true,
        scale: true,
        x: true,
        y: true,
        width: true,
        height: true
      }
    }))
    .map( eye => [eye.id, { ...eye }])
  )

  // Get all eyes that are already rated by this user
  const gradings = (await prisma.grading.findMany({ 
    where: { userId: user.id },
    select: { eyeId: true }
  }))

  // Stats
  const stats = {
    total: Object.keys(eyes).length,
    done: gradings.length,
  }
  stats.todo = stats.total - stats.done

  // Remove previously graded eyes
  for (const grading of gradings) delete eyes[grading.eyeId]
 
  return res.send({
    stats,
    eye: stats.todo > 0
      ? Object.values(eyes).pop()
      : false
  })
}

export default handler

