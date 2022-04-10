/* 
 * This is the VaHI confifguration file
 *
 * Check the inline comments for details on what is what
 */
const config = {
  // Location of the database relative to the root of the app
  // Note: If you update this, you MUST also update it in the prisma/prisma.schema file
  db: {
    path: 'db/vahi.db'
  },
  // Controls the length and complexity of the auto-generated invite codes
  invites: {
    // Construct random invite codes out of these characters
    characters: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789-',
    // Length of the invite codes
    length: 32,
  },
  // Controls the length and complexity of the auto-generated passwords for admins
  passwords: {
    // Construct random passwords out of these characters
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=-_)(*&^%$#@!|}{][:;?>.<,',
    // Length of the random passwords
    length: 42,
    // Hashing algorithm to use. Run `openssl list -digest-algorithms` to see what's available
    algorithm: 'sha512',
  },
  // The seed database script (npm run seed) will populate the database with the records you define below
  seed: {
    // Roles to create
    role: [
      {
        id: 'analyst',
        description: 'Analysts can read/export data but not make any changes',
      },
      {
        id: 'admin',
        description: 'Administrators can create invites and add new eyes/pictures to score',
      },
      {
        id: 'superadmin',
        description: 'SuperAdministrators can do everything, including creating administrators',
      },
    ],
    // Admin users to create
    admin: [
      { 
        email: 'root@vahi.eu', 
        roleId: 'superadmin',
        notes: 'Superadmin role as defined in the configuration file',
      },
    ],
    // Users to create 
    // Note that 'id' holds the invite code
    user: [
      {
        id: 'vahi',
        createdBy: 'root@vahi.eu',
        isDemoUser: true,
        isActive: true,
        notes: 'Demo user as defined in the configuration file'
      }
    ]
  }
}

export default config
