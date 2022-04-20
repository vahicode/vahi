import { PrismaClient } from '@prisma/client'
import { generateInvite, authenticate } from 'api/utils.mjs'

import jwt from 'passport-jwt'
import config from '../../vahi.config.mjs'

const options = {
  jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  ...config.jwt
}

const prisma = new PrismaClient()

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Get users
  const users = await prisma.user.findMany()

  return res.send(users)
}

export default handler
