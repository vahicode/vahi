import prisma from 'api/prisma.mjs'
import { authenticate } from 'api/utils.mjs'
import middleware from 'middleware/index.js'
import nextConnect from 'next-connect'
import fs from 'fs'
import probe from 'probe-image-size'

const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req)
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Is this a multi-upload?
  const files = (Array.isArray(req.files))
    ? req.files
    : req.files?.files
      ? [ req.files.files ]
      : [ req.files ]

  if (!files) return res.status(400).send()

  // Create eye
  const eyes = []
  for (const file of files) {
    const img = fs.readFileSync(file.filepath)
    const { width, height } = probe.sync(img)
    const eye = await prisma.eye.create({
      data: {
        createdBy: admin.email,
        notes: file.originalFilename,
        mimetype: file.mimetype,
        img,
        width,
        height,
      }
    })
    eyes.push(eye.id)
  }

  return res.send(eyes)
})

//handler.delete(async (req, res) => {
//
//  // Admin authentication
//  const admin = authenticate.admin(req)
//  if (!admin) return res.status(403)
//    .send({ error: 'authentication_failed' })
//
//  console.log(req.params)
//  //// Create eye
//  //const eye = await prisma.eye.create({
//  //  data: {
//  //    createdBy: admin.email,
//  //    notes: req.files.files.originalFilename,
//  //    img: fs.readFileSync(req.files.files.filepath),
//  //  }
//  //})
//
//  return res.send({})
//})
//
export default handler

export const config = {
  api: {
    bodyParser: false
  }
}
