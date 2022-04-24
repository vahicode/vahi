import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'
import { loadNextEye } from './load.js'

const prisma = new PrismaClient()

const formatGrades = (type, grades) => Object.fromEntries(Object.values(grades[type]).map((v,i) => [ `${type.slice(0,1)}${i+1}`, parseInt(v)]))

const handler = async (req, res) => {

  // Is this a valid request
  if (!req.body?.eye 
    || !req.body?.grades 
    || !req.body.grades?.vascularity
    || !req.body.grades?.haze
    || !req.body.grades?.integrity
  ) return res.status(400).send({error: 'invalid_data'})

  // User authentication
  const user = authenticate.user(req)
  if (!user) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Is this user active?
  if (!user.isActive) return res.status(403)
    .send({ error: 'invite_inactive' })

  // First save the grades for this eye
  const result = await prisma.grading.create({ 
    data: {
      eyeId: req.body.eye,
      userId: user.id,
      ...formatGrades('vascularity', req.body.grades),
      ...formatGrades('haze', req.body.grades),
      ...formatGrades('integrity', req.body.grades)
    }
  })
  
  // Then load the next eye
  const next = await loadNextEye(user)

  return res.send(next)
}

export default handler

