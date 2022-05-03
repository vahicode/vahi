import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'
import middleware from 'middleware/index.js'
import nextConnect from 'next-connect'
import fs from 'fs'
import probe from 'probe-image-size'

const type = 'iimg'
const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Is this a multi-upload?
  const file = req.files[type]
  if (!file) return res.status(400).send()

  // Create image
  const img = fs.readFileSync(file.filepath)
  const { width, height } = probe.sync(img)
  const image = await prisma.image.create({
    data: {
      createdBy: admin.email,
      integrity: (type === 'iimg'),
      mimetype: file.mimetype,
      img,
      width,
      height,
    }
  })

  return res.send(image.id)
})

export default handler

export const config = {
  api: {
    bodyParser: false
  }
}

