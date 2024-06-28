const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const { 
  fetchUserByEmail,
  createNewUser
} = require('../../helper/user')
const clientid = process.env.GOOGLE_CLIENT_ID
const clientsecret = process.env.GOOGLE_CLIENT_SECRET

passport.use(
  new OAuth2Strategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await fetchUserByEmail(profile.email);
        if (existingUser) {
          return done(null, existingUser)
        } else {
          const data = {
            email: profile.email,
            fullName: profile.displayName,
            is_profile_verified: true,
            profile_img: profile.picture
          }
          const user = await createNewUser(data)
          return done(null, user)
        }
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
});