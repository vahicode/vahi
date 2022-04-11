import { PrismaClient } from '@prisma/client'
import { checkPassword } from 'api/utils.mjs'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  let result = false
  try {
    result = await prisma.Admin.findUnique({ 
      where: {
        email: req.body.username
      }
    })
  }
  catch (err) {
    console.log(err)
  }
  if (!result) return res.status(403).send({ error: 'login_failed' })

  const [ hash, algo, salt ] = result.password.split(':')

  if (checkPassword(req.body.password, hash, salt)) {
    console.log('looks good')
  } else {
    console.log('auth failed')
  }


  return res.send(result)
}

export default handler
