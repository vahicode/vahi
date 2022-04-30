import { prisma, checkPassword, getJWT } from 'api/utils.mjs'

const handler = async (req, res) => {
  // Load admin account from database
  let result = false
  try {
    result = await prisma.Admin.findUnique({ 
      where: {
        // Note that we force this to lowercase because we also save that way
        email: req.body.username.toLowerCase()
      }
    })
  }
  catch (err) {
    console.log(err)
  }
  // If it's not found, that means there's no such user
  if (!result) return res.status(403).send({ error: 'login_failed' })

  // Get password hash and salt
  const [ hash, algo, salt ] = result.password.split(':')

  // Check if password is correct
  if (checkPassword(req.body.password, hash, salt)) {
    // Password is correct, but is the account active?
    if (!result.isActive) return res.status(403).send({ error: 'account_inactive' })
    // Looks good, but don't leak the password hash/salt
    delete result.password
    // Generate token, and stuff it with account data
    const token = getJWT({
      _id: result.email,
      ...result
    })
    // Update last login time
    await prisma.Admin.update({
      where: { email: result.email },
      data: { lastLogin: new Date() }
    })

    // Return token
    return res.send({ token, admin: result })
  }
  else return res.status(403).send({ error: 'login_failed' })

  return res.send(result)
}

export default handler
