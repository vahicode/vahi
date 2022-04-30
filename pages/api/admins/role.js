import { prisma, authenticate } from 'api/utils.mjs'

const handler = async (req, res) => {

  if (req.method !== 'PUT') return res.status(400).send({ 
    error: 'method_invalid', invalid: req.method, valid: 'PUT' 
  })

  // Admin authentication
  const admin = authenticate.admin(req, 'superadmin')
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Check that admin and role is set
  if (!req.body.admin || !req.body.role) return res.status(400)
    .send({ error: 'no_role_specified' })  

  // Update eye
  const record = await prisma.admin.update({
    where: { email: req.body.admin },
    data: { role: req.body.role }
  })
  // Don't reveal (hashed) password
  delete record.password

  return res.send(record)
}

export default handler
