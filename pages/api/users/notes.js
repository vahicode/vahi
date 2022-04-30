import { prisma, authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that eye and notes is set
  if (!req.body.user || !req.body.notes) return res.status(400)
    .send({ error: 'no_user_specified' })  

  // Update eye
  const user = await prisma.user.update({
    where: { id: req.body.user },
    data: { notes: req.body.notes }
  })
  
  return res.send(user)
}

export default handler
