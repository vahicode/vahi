import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'

const allEyes = async () => Object.fromEntries(
  (await prisma.eye.findMany({ 
    where: { isActive: true },
    select: {
      id: true,
      vImg: {
        select: {
          id: true,
          scale: true,
          x: true,
          y: true,
          mimetype: true,
          width: true,
          height: true,
        },
      },
      iImg: {
        select: {
          id: true,
          width: true,
          height: true,
        }
      }
    },
    orderBy: { id: 'asc' }
  }))
  .map( eye => [eye.id, { ...eye }])
)

export const loadNextEye = async (user) => {
  // Get all active eyes
  const eyes = await allEyes()

  // Get submitted gradings
  const gradings = (await prisma.grading.findMany({ 
    where:  { userId: user.id },
    select: { eyeId: true },
  }))

  // Generate stats
  const stats = {
    total: Object.keys(eyes).length,
    done: gradings.length,
  }
  stats.todo = stats.total - stats.done

  // Remove previously graded eyes
  for (const grading of gradings) delete eyes[grading.eyeId]

  return {
    stats,
    eye: stats.todo > 0
      ? Object.values(eyes).pop()
      : false
  }
}

export const loadNextDemoEye = async (eyeId=0) => {

  // Get all active eyes
  const eyes = await allEyes()

  // Generate stats
  const stats = {
    total: Object.keys(eyes).length,
  }
  const todo = Object.values(eyes).filter(eye => eye.id > eyeId)
  stats.todo = todo.length
  stats.done = stats.total - stats.todo

  return {
     stats,
     eye: todo.length > 0
       ? todo.shift()
       : false
  }
}

const handler = async (req, res) => {

  // User authentication
  const user = authenticate.user(req)
  if (!user) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Is this user active?
  if (!user.isActive) return res.status(403)
    .send({ error: 'invite_inactive' })

  const data = user.isDemoUser
    ? await loadNextDemoEye()
    : await loadNextEye(user)

  return res.send(data)
}

export default handler

