const bcrypt = require("bcrypt")
const crypto = require("crypto")
const moment = require("moment")
const {
  fetchUserByEmail,
  createNewUser,
  getUserData,
  fetchUserById,
  updateUserPassword,
  findUserByTelegramId,
  fetchUserByPhoneNumber
} = require("../../helper/user")
const {
  createPasswordReset,
  fetchPasswordToken,
  deleteToken,
  fetchTokenByUserId,
} = require("../../helper/passwordReset")
const {
  saveOtpDetails,
  fetchOtp,
  updateOtpDetails,
  verifyEmailOtp,
} = require("../../helper/otp")
const { createToken } = require("../../utils/jwt")
const { sendMail } = require("../../utils/sendEmail")
const {
  sendSMSVerificationOTP,
  verifySMSOTP,
} = require("../../services/telynxServices")
const {
  PASSWORD_RESET_TOKEN_EXPIRE_TIME,
  FE_APP_BASE_URL,
  REWARD_POINTS
} = require("../../constant/constants")
const { sendNotification } = require("../../helper/sendNotification")
const { addUserRewardPoints } = require("../../helper/rewards")
const { generateUniqueNumber } = require("../../utils/helperFuncs");
const { addTokenToBlacklist } = require("../../utils/tokenBlacklist");
const { logger } = require("../../utils/logger")
const { verifyEmailUsingNeutrino } = require("../../services/neutrinoServices")
const { verifyPhoneNumberUsingHlrLookup } = require("../../services/hlrLookupservices")

const signUp = async (req, res) => {
  const { email, password, phoneNumber, notify_mobile } = req.body
  try {
    if (notify_mobile && (!phoneNumber || !phoneNumber.length)) {
      return res
        .status(400)
        .json({ message: "Phone Number is required for notifications." })
    }
    const existingUser = await fetchUserByEmail(email)
    if (existingUser) {
      return return res.status(400).json({ message: "Email Address already in use" })
    }
    const emailVerification = await verifyEmailUsingNeutrino(email)
    if (!emailVerification) {
      return return res.status(400).json({ message: "Email is not valid" })
    }
    if (phoneNumber && phoneNumber.length) {
      const checkUserWithPhoneNum = await fetchUserByPhoneNumber(phoneNumber)
      if (checkUserWithPhoneNum) {
        return return res.status(400).json({ message: "Phone Number already in use" })
      }
      const phoneVerification = await verifyPhoneNumberUsingHlrLookup(phoneNumber)
      if (!phoneVerification) {
        return return res.status(400).json({ message: "Phone Number is not valid" })
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const data = {
      email,
      password: hashedPassword,
      phoneNumber,
      notify_mobile,
      notify_email: true,
      referral_code: `ref_${generateUniqueNumber()}`
    }
    const user = await createNewUser(data)
    const userData = await getUserData(user)
    if (user) {
      let rewardPoints = {
        userId: user._id,
        points: REWARD_POINTS.SIGNUP.points,
        reason: REWARD_POINTS.SIGNUP.message,
      }
      await addUserRewardPoints(rewardPoints)
      const otpDetails = await saveOtpDetails(email)
      const verificationLink = `${FE_APP_BASE_URL}/verify-email`
      await sendNotification({
        user: userData,
        message:
          "Congrats! You have successfully signed up for Bozzmail. The verification code has been to sent to you registered email. The code is valid upto 5 min.",
        emailMessage: `<p>Congrats! You have successfully signed up for Bozzmail. The verification code for your email is ${otpDetails.otp}. The code is valid upto 5 min. Click on this <a href="${verificationLink}" target="_blank">verifcation link</a> to verify your email.</p>`,
        emailSubject: "Sign Up successful. Verify your email",
      })
      res
        .status(200)
        .json({ message: "User created Successfully", data: userData })
    } else {
      return res.status(500).json({ message: "Failed to create a new user" })
    }
  } catch (error) {
    const err = { message: 'Failed to signup new user', error: error }
    logger.error(err)
    return return res.status(error.status || 500).json(err)
  }
}

const signInWithPhoneNum = async (req, res) => {
  const { otp, phoneNumber } = req.body
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res
        .status(400)
        .json({ message: "Phone Number is required" })
    }
    if (!otp || !otp.length) {
      return res
        .status(400)
        .json({ message: "OTP is required" })
    }
    const response = await verifySMSOTP(phoneNumber, otp)
    if (response && response.data.response_code === "accepted") {
      const existingUser = await fetchUserByPhoneNumber(phoneNumber)
      if (existingUser) {
        const token = createToken(existingUser._id)
        await sendNotification({
          user: existingUser,
          message:
            "Congrats! You have successfully signed in for Bozzmail.",
        })
        return res
          .status(200)
          .json({
            message: "Sign In",
            data: existingUser,
            token: token,
          })
      } else {
        const data = {
          phoneNumber,
          notify_mobile: true,
          is_profile_verified: true,
          referral_code: `ref_${generateUniqueNumber()}`
        }
        const user = await createNewUser(data)
        if (user) {
          const userToken = createToken(user._id)
          let rewardPoints = {
            userId: user._id,
            points: REWARD_POINTS.SIGNUP.points,
            reason: REWARD_POINTS.SIGNUP.message,
          }
          await addUserRewardPoints(rewardPoints)
          await sendNotification({
            user: user,
            message:
              "Congrats! You have successfully signed up for Bozzmail.",
          })
          res
            .status(200)
            .json({ message: "User created Successfully", data: user, token: userToken })
        } else {
          return res.status(500).json({ message: "Failed to create a new user" })
        }
      }
    } else {
      return return res.status(500).json({ error: "OTP code is not correct" })
    }
  } catch (error) {
    const err = { message: 'Failed to signin user with phone number', error: error }
    logger.error(err)
    return return res.status(error.status || 500).json(err)
  }
}

const signIn = async (req, res) => {
  const { email, otp, password, verificationCode } = req.body
  const action = req.params.action
  try {
    const existingUser = await fetchUserByEmail(email, true)
    if (!existingUser || !existingUser.is_active) {
      return return res.status(400).json({ message: "Email is incorrect" })
    }
    const token = createToken(existingUser._id)
    const userData = await getUserData(existingUser)
    switch (action) {
      case "request": // to prompt user details for login methods available to the user
        return res.status(200).json({ data: userData })
        break
      case "password": // to login with password
        if (!password || !password.length) {
          return return res.status(400).json({ message: "Password is required" })
        }
        if (!existingUser.password) {
          return res
            .status(400)
            .json({ message: "Password not found. Try Different method" })
        }
        const isPasswordMatch = await bcrypt.compare(
          password,
          existingUser.password
        )
        if (!isPasswordMatch) {
          return res
            .status(400)
            .json({ message: "Email or password is incorrect" })
        }
        await sendNotification({
          user: existingUser,
          message: "Congrats! You have successfully logged in for Bozzmail.",
          emailMessage: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`,
          emailSubject: "Logged in for bozzmail successful.",
        })
        res
          .status(200)
          .json({
            message: "User successfully logged in",
            data: userData,
            token: token,
          })
        break
      case "otp": // to login with the SMS OTP after providing email
        if (!otp || !otp.length) {
          return return res.status(400).json({ message: "OTP Code is required" })
        }
        const response = await verifySMSOTP(existingUser.phoneNumber, otp)
        if (response.data && response.data.response_code === "accepted") {
          await sendNotification({
            user: existingUser,
            message: "Congrats! You have successfully logged in for Bozzmail.",
            emailMessage: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`,
            emailSubject: "Logged in for bozzmail successful.",
          })
          res
            .status(200)
            .json({
              message: "Verification Complete",
              data: userData,
              token: token,
            })
        } else {
          return res.status(500).json({ message: "OTP is not correct" })
        }
        break
      case "email": // to login with email verification code
        if (!verificationCode || !verificationCode.length) {
          return res
            .status(400)
            .json({ message: "Verification Code is required" })
        }
        const emailResponse = await verifyEmailOtp(email, verificationCode)
        if (!existingUser.is_profile_verified) {
          existingUser.is_profile_verified = true
        }
        await existingUser.save()
        if (emailResponse) {
          await sendNotification({
            user: existingUser,
            message: "Congrats! You have successfully logged in for Bozzmail.",
            emailMessage: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`,
            emailSubject: "Logged in for bozzmail successful.",
          })
          res
            .status(200)
            .json({
              message: "Verification Complete",
              data: userData,
              token: token,
            })
        } else {
          res
            .status(500)
            .json({ message: "Verification Code is not valid or expired." })
        }
        break
      default:
        return res.status(500).json({ message: "Something went wrong." })
    }
  } catch (error) {
    const err = { message: 'Failed to signin user', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body
  try {
    const existingUser = await fetchUserByEmail(email)
    if (!existingUser || !existingUser.is_active) {
      return return res.status(400).json({ message: "Email is incorrect" })
    }
    const existingToken = await fetchTokenByUserId(existingUser._id)
    const token = crypto.randomBytes(32).toString("hex")
    let expiresAt = moment().utc().add(PASSWORD_RESET_TOKEN_EXPIRE_TIME, "hour")
    if (existingToken) {
      existingToken.token = token
      existingToken.expiresAt = expiresAt
      existingToken.save()
    } else {
      const data = {
        userId: existingUser._id,
        token: token,
        expiresAt: expiresAt,
      }
      await createPasswordReset(data)
    }
    const resetLink = `${FE_APP_BASE_URL}/verify-reset-password/${token}`
    const mail = await sendMail({
      user: existingUser,
      subject: "Password Reset",
      text: `You requested for a password reset. Click on this link to reset your password: ${resetLink}`,
      heading: "Password Reset",
      content: `<p>You requested for a password reset. Click on this <a href="${resetLink}" target="_blank">reset link</a> to reset your password.</p>`,
    })
    if (!mail) {
      return res.status(401).json({ message: 'Email not sent. Invalid credentials' })
    }
    await sendNotification({
      user: existingUser,
      message:
        "You requested for a password reset. Check your email for the reset link.",
    })
    res
      .status(200)
      .json({ message: "Password Verification link sent to registered email" })
  } catch (error) {
    const err = { message: 'Failed to send user password reset link', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const resetUserPassword = async (req, res) => {
  const { token, newPassword } = req.body
  try {
    const tokenData = await fetchPasswordToken(token)
    if (!tokenData) {
      return return res.status(400).json({ message: "Token is not Valid or expired" })
    }
    if (tokenData.expiresAt < new Date().toISOString()) {
      await deleteToken(tokenData._id)
      return res
        .status(400)
        .json({
          message: "Token expired. Please request a new password reset.",
        })
    }
    const userData = await fetchUserById(tokenData.userId)
    if (!userData) {
      return res.status(404).json({ message: "User not found." })
    }
    await updateUserPassword(userData._id, newPassword)
    await deleteToken(tokenData._id)
    await sendNotification({
      user: userData,
      message: "Your password for your account has been reset successfully.",
      emailMessage: `<p>Your password for your account has been reset successfully.</p>`,
      emailSubject: "Account Password reset successfuly",
    })
    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    const err = { message: 'Failed to reset user password', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const sendSMSVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return return res.status(400).json({ message: "Phone number is required" })
    }
    const phoneVerification = await verifyPhoneNumberUsingHlrLookup(phoneNumber)
    if (!phoneVerification) {
      return return res.status(400).json({ message: "Phone Number is not valid" })
    }
    const response = await sendSMSVerificationOTP(phoneNumber)
    if (response.data) {
      res
        .status(200)
        .json({ message: "Verification code sent", data: response.data })
    } else {
      return res.status(500).json({ message: "Failed to send verification code" })
    }
  } catch (error) {
    const err = { message: 'Failed to send otp for phone number', error: error?.errors || error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const verifySMSCode = async (req, res) => {
  const { phoneNumber, otp } = req.body
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return return res.status(400).json({ message: "Phone number is required" })
    }
    if (!otp || !otp.length) {
      return return res.status(400).json({ message: "OTP Code is required" })
    }
    const response = await verifySMSOTP(phoneNumber, otp)
    if (response.data && response.data.response_code === "accepted") {
      res
        .status(200)
        .json({ message: "Verification Complete", data: response.data })
    } else {
      return return res.status(500).json({ error: "OTP code is not correct" })
    }
  } catch (error) {
    const err = { message: 'Failed to verify otp for phone number', error: error?.errors || error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const verifyEmailAddress = async (req, res) => {
  const { emailId } = req.body
  try {
    if (!emailId || !emailId.length) {
      return return res.status(400).json({ message: "Email Id is required" })
    }
    const emailVerification = await verifyEmailUsingNeutrino(emailId)
    if (emailVerification) {
      res
        .status(200)
        .json({ message: "Verification complete", data: emailVerification })
    } else {
      return res.status(500).json({ message: "Email is not valid" })
    }
  } catch (error) {
    const err = { message: 'Failed to validate email', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const verifyPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return return res.status(400).json({ message: "Phone Number is required" })
    }
    const phoneVerification = await verifyPhoneNumberUsingHlrLookup(phoneNumber)
    if (phoneVerification) {
      res
        .status(200)
        .json({ message: "Verification complete", data: phoneVerification })
    } else {
      return res.status(500).json({ message: "Phone Number is not valid" })
    }
  } catch (error) {
    const err = { message: 'Failed to validate phone number', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const sentVerificationEmailCode = async (req, res) => {
  const { email } = req.body
  try {
    const user = await fetchUserByEmail(email)
    if (!user) {
      return return res.status(400).json({ message: "Email Address not found" })
    }
    const existingToken = await fetchOtp(email)
    const otpDetails = existingToken
      ? await updateOtpDetails(email)
      : await saveOtpDetails(email)
    const mail = await sendMail({
      user: user,
      subject: "Email Verification Code",
      text: `You requested for a email verification code.`,
      content: `<p>You requested for a email verification. The OTP for your account is ${otpDetails.otp}. These is valid upto 5 min</p>`,
    })
    if (!mail) {
      return res.status(401).json({ message: 'Email not sent. Invalid credentials' })
    }
    await sendNotification({
      user: user,
      message:
        "You requested for a email verification.. Check your email for code.",
    })
    res
      .status(200)
      .json({
        message: "Email Verification code sent on registered email",
      })
  } catch (error) {
    const err = { message: 'Failed to send email verification code', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const googleLoginSuccess = async (req, res) => {
  try {
    if (req.user && req.user._id) {
      const token = createToken(req.user._id)
      await sendNotification({
        user: req.user,
        message: "You have successful logged in for bozzmail.",
        emailMessage: `<p>You have successful logged in for bozzmail.</p>`,
        emailSubject: "Login successful in bozzmail",
      })
      res
        .status(200)
        .json({ message: "User login", data: req.user, token: token })
    } else {
      return res.status(500).json({ message: 'Error signin user with google' })
    }
  } catch (error) {
    const err = { message: 'Error signin user with google', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const telegramLoginSuccess = async (req, res) => {
  const { first_name, last_name, id, photo_url } = req.body
  try {
    const user = await findUserByTelegramId(id)
    if (user) {
      const token = createToken(user._id)
      await sendNotification({
        user: user,
        message: "Welcome to bozzmail. Your have successfuly logged in.",
      })
      return return res.status(200).json({ message: "User login", data: user, token: token })
    }
    const data = {
      telegramId: id,
      fullName: `${first_name} ${last_name}`,
      is_profile_verified: true,
      notify_email: false,
      referral_code: `ref_${generateUniqueNumber()}`
    }
    if (photo_url) {
      data.profile_img = photo_url
    }
    const newUser = await createNewUser(data)
    let rewardPoints = {
      userId: newUser._id,
      points: REWARD_POINTS.SIGNUP.points,
      reason: REWARD_POINTS.SIGNUP.message,
    }
    await addUserRewardPoints(rewardPoints)
    const token = createToken(newUser._id)
    await sendNotification({
      user: newUser,
      message:
        "Welcome to bozzmail. Your account has been created successfully.",
    })
    return res.status(200).json({ message: "User login", data: newUser, token: token })
  } catch (error) {
    const err = { message: 'Error login with telegram', error: error }
    logger.error(err)
    return res.status(error.status || 500).json(err)
  }
}

const logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    try {
      const token = req.headers.token
      if (token) {
        addTokenToBlacklist(token);
        return res.status(200).json({ message: 'Logged out successfully' });
      } else {
        return res.status(400).json({ message: 'No token provided' });
      }
    } catch (error) {
      const err = { message: 'Failed to logout user', error: error }
      logger.error(err)
      return res.status(error.status || 500).json(err)
    }
  })
}

module.exports = {
  sendSMSVerificationCode,
  verifySMSCode,
  verifyEmailAddress,
  signUp,
  signIn,
  signInWithPhoneNum,
  sendResetPasswordLink,
  resetUserPassword,
  sentVerificationEmailCode,
  googleLoginSuccess,
  verifyPhoneNumber,
  telegramLoginSuccess,
  logout,
}
