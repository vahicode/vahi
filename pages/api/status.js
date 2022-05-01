import prisma from 'api/prisma.mjs'
import { schemaDbFileIsPresent } from 'api/utils.mjs'
import config from '../../vahi.config.mjs'

const ok = [true, 'Looks good']

const handler = async (req, res) => {
  const schema = schemaDbFileIsPresent()
  // Is there a root admin account in the database?
  const status = {
    status: 'green',
    error: false,
    initialized: true,
    valid: {
      'Admin Email': config.root.email 
        ? ok 
        : [false, 'Please configure root.email with an email address for the root admin'],
      'Database Path': config.db.path 
        ? ok 
        : [false, 'Please configure db.path to point to your database file'],
      'Database Schema': schema
        ? ok
        : [false, 'Please ensure there is an empty database file named schema.db file in the db folder'],
      'JWT Secret': config.jwt.secret 
        ? ok 
        : [false, 'Please set the VAHI_SECRET environment variable to a random string']
    }
  }
  let result = false
  try {
    result = await prisma.Admin.findUnique({ 
      where: { email: config.root.email }
    })
    if (!result) {
      status.status = 'yellow'
      status.initialized = false
    }
  }
  catch (err) {
    // See: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    if (err.code === 'P2021') {
      status.initialized = false
      status.error = 'VaHI is not (yet) initialized',
      status.status = 'yellow'
    } else {
      status.initialized = null,
      status.error = 'Unknown error: '+err.message,
      status.status = 'red'
    }
  }

  return res.send(status)
}

export default handler
