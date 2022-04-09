const config = {
  // Database
  db: {
    folder: 'db',
    file: 'vahi.db',
    // VaHI database schema for sqlite3
    schema: {
      roles: {
        // The unique ID of the admin (primary key)
        id: [ 'TEXT', 'PRIMARY KEY' ], 
        // The description of the role
        description: [ 'TEXT', 'NOT NULL' ], 
      },
      admins: {
        // The unique ID (email) of the admin (primary key)
        email: [ 'TEXT', 'PRIMARY KEY' ],
        // The password hash
        password: [ 'TEXT', 'NOT NULL' ], 
        // The role of this admin
        role: [ 'TEXT', 'NOT NULL' ], 
        // Any notes added by the superadmin
        notes: [ 'TEXT' ],
        // Whether or not this admin is active (1 for yes)
        active: [ 'INTEGER' ],
        // ISO8601 date representation of the last login by this admin
        lastlogin: [ 'TEXT' ],
        // Extra foreign key contraints
        foreign_keys: {
          role: ['role', 'id'],
        }
      },
      users: {
        // The unique ID of the user (primary key)
        id: [ 'INTEGER', 'PRIMARY KEY' ], 
        // The admin who created this user
        by: [ 'TEXT', 'NOT NULL' ],
        // Whether or not this is a demo user (1 for yes)
        demo: [ 'INTEGER' ],
        // The invite code for this user
        invite: [ 'TEXT', 'NOT NULL', 'UNIQUE' ],
        // Whether or not this user is active (1 for yes)
        active: [ 'INTEGER' ],
        // ISO8601 date representation of the last login by this user
        lastlogin: [ 'TEXT' ],
        // Any notes added by the admin
        notes: [ 'TEXT' ],
        // Extra foreign key contraints
        foreign_keys: {
          by: ['admin', 'email'],
        }
      },
      eyes: {
        // The unique ID of the eye (primary key)
        id: [ 'INTEGER', 'PRIMARY KEY' ], 
        // The admin who created this user
        by: [ 'TEXT', 'NOT NULL' ],
        // Whether or not this user is active (1 for yes)
        active: [ 'INTEGER' ],
        // Any notes added by the admin
        notes: [ 'TEXT' ],
        // Extra foreign key contraints
        foreign_keys: {
          by: ['admin', 'email'],
        }
      },
      pictures: {
        // The unique ID of the picture (primary key)
        id: [ 'INTEGER', 'PRIMARY KEY' ], 
        // The admin who created this eye
        by: [ 'TEXT', 'NOT NULL' ],
        // The ID of the eye this is a picture of (foreign key)
        eye: [ 'INTEGER' ], 
        // Storing the actual image in DB so that backup is easy
        img: [ 'BLOB' ],
        // Extra foreign key contraints
        foreign_keys: {
          by: ['admin', 'email'],
          eye: ['eyes', 'id'],
        }
      },
      ratings: {
        // The unique ID of the rating (primary key)
        id: [ 'INTEGER', 'PRIMARY KEY' ], 
        // The user who submitted the rating (foreign key)
        user: [ 'INTEGER', 'NOT NULL' ],
        // The eye that was rated (foreign key)
        eye: [ 'INTEGER', 'NOT NULL' ],
        // ISO8601 date representation of when this rating was submitted
        time: [ 'TEXT', 'NOT NULL' ],
        // 13 total fields for holding the v-scores (vascularity) of each zone
        v1:  [ 'INTEGER' ],
        v2:  [ 'INTEGER' ],
        v3:  [ 'INTEGER' ],
        v5:  [ 'INTEGER' ],
        v6:  [ 'INTEGER' ],
        v7:  [ 'INTEGER' ],
        v8:  [ 'INTEGER' ],
        v9:  [ 'INTEGER' ],
        v10: [ 'INTEGER' ],
        v11: [ 'INTEGER' ],
        v12: [ 'INTEGER' ],
        v13: [ 'INTEGER' ],
        // 13 total fields for holding the h-scores (haze) of each zone
        h1:  [ 'INTEGER' ],
        h2:  [ 'INTEGER' ],
        h3:  [ 'INTEGER' ],
        h5:  [ 'INTEGER' ],
        h6:  [ 'INTEGER' ],
        h7:  [ 'INTEGER' ],
        h8:  [ 'INTEGER' ],
        h9:  [ 'INTEGER' ],
        h10: [ 'INTEGER' ],
        h11: [ 'INTEGER' ],
        h12: [ 'INTEGER' ],
        h13: [ 'INTEGER' ],
        // 13 total fields for holding the i-scores (integrity) of each zone
        i1:  [ 'INTEGER' ],
        i2:  [ 'INTEGER' ],
        i3:  [ 'INTEGER' ],
        i5:  [ 'INTEGER' ],
        i6:  [ 'INTEGER' ],
        i7:  [ 'INTEGER' ],
        i8:  [ 'INTEGER' ],
        i9:  [ 'INTEGER' ],
        i10: [ 'INTEGER' ],
        i11: [ 'INTEGER' ],
        i12: [ 'INTEGER' ],
        i13: [ 'INTEGER' ],
        // Extra foreign key contraints
        foreign_keys: {
          eye: ['eyes', 'id'],
          user: ['users', 'id'],
        }
      }
    }
  },
  passwords: {
    // Construct random passwords out of these characters
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=-_)(*&^%$#@!|}{][:;?>.<,',
    // Length of the random passwords
    length: 42,
    // Hashing algorithm to use. Run `openssl list -digest-algorithms` to see what's available
    algorithm: 'sha512',
  },
  // Email of the root admin account that's created by the init script
  rootadmin: 'root@vahi.eu',
}

export default config
