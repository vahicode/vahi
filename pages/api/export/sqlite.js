import sqlite3 from 'sqlite3'
import config from '../../../vahi.config.mjs'
import prisma from 'api/prisma.mjs'
import fs from 'fs'
import { authenticate } from 'api/utils.mjs'

// You can get this with the .schema command in sqlite3 CLI
const schema = `
CREATE TABLE IF NOT EXISTS "Grading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eyeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "v1" INTEGER NOT NULL,
    "v2" INTEGER NOT NULL,
    "v3" INTEGER NOT NULL,
    "v4" INTEGER NOT NULL,
    "v5" INTEGER NOT NULL,
    "v6" INTEGER NOT NULL,
    "v7" INTEGER NOT NULL,
    "v8" INTEGER NOT NULL,
    "v9" INTEGER NOT NULL,
    "v10" INTEGER NOT NULL,
    "v11" INTEGER NOT NULL,
    "v12" INTEGER NOT NULL,
    "v13" INTEGER NOT NULL,
    "h1" INTEGER NOT NULL,
    "h2" INTEGER NOT NULL,
    "h3" INTEGER NOT NULL,
    "h4" INTEGER NOT NULL,
    "h5" INTEGER NOT NULL,
    "h6" INTEGER NOT NULL,
    "h7" INTEGER NOT NULL,
    "h8" INTEGER NOT NULL,
    "h9" INTEGER NOT NULL,
    "h10" INTEGER NOT NULL,
    "h11" INTEGER NOT NULL,
    "h12" INTEGER NOT NULL,
    "h13" INTEGER NOT NULL,
    "i" INTEGER NOT NULL
);
`

const exportpath = config.db.path+'_export.db'

const handler = async (req, res) => {

  // Admin authentication
  const admin = authenticate.admin(req, ['admin', 'superadmin'])
  if (!admin) return res.status(403)
    .send({ error: 'authentication_failed' })

  // Create empty database (make sure to remove it first)
  try {
    fs.unlinkSync(exportpath)
  } catch (err) { }
  const exportdb = new sqlite3.Database(exportpath)
  exportdb.run(schema)

  // Get gradings
  for (const grades of (await prisma.grading.findMany())) {
    exportdb.run(`INSERT INTO "Grading" 
      ( 
        id, createdAt, eyeId, userId, 
        v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, 
        h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, 
        i 
      ) VALUES (
        $id, $createdAt, $eyeId, $userId,
        $v1, $v2, $v3, $v4, $v5, $v6, $v7, $v8, $v9, $v10, $v11, $v12, $v13,
        $h1, $h2, $h3, $h4, $h5, $h6, $h7, $h8, $h9, $h10, $h11, $h12, $h13,
        $i
      );`, {
        $id: grades.id,
        $createdAt: grades.createdAt, 
        $eyeId: grades.createdAt,
        $userId: grades.userId.slice(0,6), // Protect invite codes
        $v1: grades.v1,
        $v2: grades.v2,
        $v3: grades.v3,
        $v4: grades.v4,
        $v5: grades.v5,
        $v6: grades.v6,
        $v7: grades.v7,
        $v8: grades.v8,
        $v9: grades.v9,
        $v10: grades.v10,
        $v11: grades.v11,
        $v12: grades.v12,
        $v13: grades.v13,
        $h1: grades.h1,
        $h2: grades.h2,
        $h3: grades.h3,
        $h4: grades.h4,
        $h5: grades.h5,
        $h6: grades.h6,
        $h7: grades.h7,
        $h8: grades.h8,
        $h9: grades.h9,
        $h10: grades.h10,
        $h11: grades.h11,
        $h12: grades.h12,
        $h13: grades.h13,
        $i: grades.i
      }
    )
  }
  // Close database
  exportdb.close()
  
  // Now return it
  await new Promise(resolve => {
    exportdb.on('close', () => {
      const buffer = fs.readFileSync(exportpath)
      resolve()
      return res
        .setHeader('Content-Type', 'application/x-sqlite3')
        .send(buffer, 'binary')
    })
  })
    //.setHeader('Content-Type', 'application/x-sqlite3')
    //.send(buffer.toJSON())
}

export default handler
