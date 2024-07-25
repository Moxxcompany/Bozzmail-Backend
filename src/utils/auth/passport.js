const passport = require("passport")
const OAuth2Strategy = require("passport-google-oauth2").Strategy
const { fetchUserByEmail, createNewUser } = require("../../helper/user")
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REWARD_POINTS,
} = require("../../constant/constants")
const { addUserRewardPoints } = require("../../helper/rewards")
const { generate12DigitNumber } = require("../helperFuncs")

passport.use(
  new OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await fetchUserByEmail(profile.email)
        if (existingUser) {
          return done(null, existingUser)
        } else {
          const data = {
            email: profile.email,
            fullName: profile.displayName,
            is_profile_verified: true,
            notify_email: true,
            profile_img: profile.picture,
            referral_code: `ref_${generate12DigitNumber()}`
          }
          const user = await createNewUser(data)
          let rewardPoints = {
            userId: user._id,
            points: REWARD_POINTS.SIGNUP.points,
            reason: REWARD_POINTS.SIGNUP.message,
          }
          await addUserRewardPoints(rewardPoints)
          return done(null, user)
        }
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
