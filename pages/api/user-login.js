import { prisma, getJWT } from 'api/utils.mjs'

const handler = async (req, res) => {
  // Load user account from database
  let result = false
  try {
    result = await prisma.User.findUnique({ 
      where: { id: req.body.invite }
    })
  }
  catch (err) {
    console.log(err)
  }
  // If it's not found, that means there's no such user
  if (!result) return res.status(403).send({ error: 'login_failed' })

  // Is this invite active?
  if (!result.isActive) return res.status(403).send({ error: 'invite_inactive' })

  // Generate token, and stuff it with account data
  const token = getJWT({
    _id: result.id,
    ...result
  })
   
  // Update last login time
  await prisma.User.update({
    where: { id: result.id },
    data: { lastLogin: new Date() }
  })

  // Return token
  return res.send({ token, user: result })
}

export default handler
