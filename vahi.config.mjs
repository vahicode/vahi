/* 
 * This is the VaHI confifguration file
 *
 * Check the inline comments for details on what is what
 */
const config = {
  // Controls the look and feel
  branding: {
    // List of enabled themes
    themes: [
      'light',
      'dark',
      'hax0r',
      'lgbtq',
      'trans',
    ],
    brand: {
      en: 'VaHI',
      fr: 'VaHI',
      nl: 'VaHI',
    },
    slogan: {
      en: "A standardized grading system for limbal stem cell deficiency",
      fr: "Un module d'évaluation standardisé pour déficience de cellules souches limbiques",
      nl: "Een gestandaardiseerd beoordelingssysteem voor limbale stamceldeficiëntier"
    },
    header: {
      logo: true,
      brand: true
    },
    footer: {
      logo: true,
      brand: true,
      slogan: true,
    }
  },
  // Location of the database relative to the root of the app
  // Note: If you update this, you MUST also update it in the prisma/prisma.schema file
  db: {
    path: 'db/vahi.db'
  },
  // Whether or not to allow demo user(s) to rate eyes
  demo: true,
  // Controls the length and complexity of the auto-generated invite codes
  invites: {
    // Construct random invite codes out of these characters
    characters: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789',
    // Length of the invite codes
    length: 32,
  },
  // JSON Web Token settings
  jwt: {
    secret: process.env.VAHI_SECRET,
    issuer: process.env.VAHI_JWT_ISSUER || 'vahi.eu',
    audience: process.env.VAHI_JWT_ISSUER || 'vahi.eu',
    expiresIn: '6 days',
  },
  // Controls the length and complexity of the auto-generated passwords for admins
  passwords: {
    // Construct random passwords out of these characters
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=-_)(*&^%#@!|}{][:;?>.<,',
    // Length of the random passwords
    length: 42,
    // Hashing algorithm to use. Run `openssl list -digest-algorithms` to see what's available
    algorithm: 'sha512',
  },
  // Root admin email - Not actually used to send email, just as the address for the root account
  rootemail: 'root@vahi.eu',
  session: {
    // Localstorage prefix
    prefix: 'VaHI_',
  },
  // The seed database script (npm run seed) will populate the database with the records you define below
  seed: {
    // Admin users to create
    admin: [
      { 
        email: 'root@vahi.eu', 
        role: 'superadmin',
        notes: 'Superadmin role as defined in the configuration file',
      },
    ],
    // Users to create 
    // Note that 'id' holds the invite code
    user: [
      {
        id: 'demo',
        createdBy: 'root@vahi.eu',
        isDemoUser: true,
        isActive: true,
        notes: 'Demo user as defined in the configuration file'
      }
    ]
  }
}

export default config
