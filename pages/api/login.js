import { getDb } from 'api/utils.mjs'

const handler = (req, res) => {
  const db = getDb()
  if (!req.body.invite) return res.status(400).json({ error: 'Please provide an invite code' })

  db.get("SELECT * FROM users WHERE invite = ?", [ req.body.invite ], result => {
    console.log(result)
    res.status(200).json({ name: 'John Doe' })
  })

  
}

export default handler
