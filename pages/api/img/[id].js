import prisma from 'api/prisma.mjs'

const handler = async (req, res) => {

  // Get ID from dynamic route
  const { id } = req.query

  // Get img
  const img = await prisma.image.findUnique({
    where: { id: parseInt(id) },
    select: { 
      img: true,
      mimetype: true
    }
  })

  return res
    .setHeader('Content-Type', img.mimetype)
    .send(img.img, 'binary')
}

export default handler
