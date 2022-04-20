import jwt from 'passport-jwt'
import config from '../../vahi.config.mjs'

const options = {
  jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  ...config.jwt
}

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function auth(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
export default passport => {
  passport.use(
    new jwt.Strategy(options, (jwt_payload, done) => {
      return done(null, jwt_payload)
    })
  )
}

