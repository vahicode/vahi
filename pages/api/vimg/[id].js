import prisma from 'api/prisma.mjs'

const handler = async (req, res) => {

  // Get ID from dynamic route
  const { id } = req.query

  // Get eyes
  const eye = await prisma.eye.findUnique({
    where: { id: parseInt(id) },
    select: { img: true }
  })

  return res
    .setHeader('Content-Type', 'image/jpeg')
    .send(eye.img, 'binary')
}

export default handler
