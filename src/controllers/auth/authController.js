const bcrypt = require("bcrypt");
const crypto = require('crypto');
const moment = require('moment');
const {
  fetchUserByEmail,
  createNewUser,
  getUserData,
  fetchUserById,
  updateUserPassword,
  findUserByTelegramId
} = require('../../helper/user')
const {
  createPasswordReset,
  fetchPasswordToken,
  deleteToken
} = require('../../helper/passwordReset')
const {
  saveOtpDetails,
  fetchOtp,
  updateOtpDetails,
  verifyEmailOtp
} = require('../../helper/otp')
const {
  createToken
} = require('../../utils/jwt')
const {
  sendMail
} = require('../../utils/sendEmail')
const {
  sendSMSVerificationOTP,
  verifySMSOTP,
  sendSMS
} = require('../../services/telynxServices');
const {
  verifyEmailId
} = require('../../services/infobipServices')
const {
  PASSWORD_RESET_TOKEN_EXPIRE_TIME,
  FE_APP_BASE_URL
} = require('../../constant/constants');
const { sendTelegramSms } = require("../../services/telegramServices");

const signUp = async (req, res) => {
  const { email, password, phoneNumber, notify_mobile } = req.body;
  try {
    if (notify_mobile && !phoneNumber && !phoneNumber.length) {
      return res.status(400).json({ message: 'Phone Number is required for notifications.' });
    }
    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email Address already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      email,
      password: hashedPassword,
      phoneNumber,
      notify_mobile
    };
    const user = await createNewUser(data)
    const userData = await getUserData(user)
    if (user) {
      const otpDetails = await saveOtpDetails(email);
      const verificationLink = `${FE_APP_BASE_URL}/verify-email`
      await sendMail({
        to: user.email,
        subject: 'Sign Up successful. Verify your email',
        text: `You have successfully signed up for bozzmail`,
        heading: 'Signup Success',
        content: `<p>Congrats! You have successfully signed up for Bozzmail. The verification code for your email is ${otpDetails.otp}. The code is valid upto 5 min. Click on this <a href="${verificationLink}" target="_blank">verifcation link</a> to verify your email.</p>`
      })
      if (notify_mobile) {
        await sendSMS({
          phoneNumber: phoneNumber,
          message: `Congrats! You have successfully signed up for Bozzmail. The verification code has been to sent to you registered email. The code is valid upto 5 min.`
        })
      }
      res.status(200).json({ message: 'User created Successfully', data: userData });
    } else {
      res.status(500).json({ message: 'Failed to create a new user' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const signIn = async (req, res) => {
  const { email, otp, password, verificationCode } = req.body;
  const action = req.params.action;
  try {
    const existingUser = await fetchUserByEmail(email, true);
    if (!existingUser || !existingUser.is_active) {
      return res.status(400).json({ message: 'Email is incorrect' });
    }
    const token = createToken(existingUser._id);
    const userData = await getUserData(existingUser)
    switch (action) {
      case 'request': // to prompt user details for login methods available to the user
        res.status(200).json({ data: userData });
        break;
      case 'password': // to login with password
        if (!password || !password.length) {
          return res.status(400).json({ message: 'Password is required' });
        }
        if (!existingUser.password) {
          return res.status(400).json({ message: 'Password not found. Try Different method' });
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
          return res.status(400).json({ message: 'Email or password is incorrect' });
        }
        await sendMail({
          to: existingUser.email,
          subject: 'Logged in for bozzmail successful.',
          text: `You have successfully logged in for bozzmail`,
          heading: 'Signin Success',
          content: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`
        })
        if (existingUser.notify_mobile && existingUser.phoneNumber) {
          await sendSMS({
            phoneNumber: existingUser.phoneNumber,
            message: `Congrats! You have successfully logged in for Bozzmail.`
          })
        }
        res.status(200).json({ message: 'User successfully logged in', data: userData, token: token });
        break;
      case "otp": // to login with the SMS OTP after providing email
        if (!otp || !otp.length) {
          return res.status(400).json({ message: 'OTP Code is required' });
        }
        const response = await verifySMSOTP(existingUser.phoneNumber, otp);
        if (!existingUser.is_profile_verified) {
          existingUser.is_profile_verified = true
        }
        await existingUser.save();
        if (response.data && response.data.response_code === 'accepted') {
          await sendMail({
            to: existingUser.email,
            subject: 'Logged in for bozzmail successful.',
            text: `You have successfully logged in for bozzmail`,
            heading: 'Signin Success',
            content: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`
          })
          if (existingUser.notify_mobile && existingUser.phoneNumber) {
            await sendSMS({
              phoneNumber: existingUser.phoneNumber,
              message: `Congrats! You have successfully logged in for Bozzmail.`
            })
          }
          res.status(200).json({ message: 'Verification Complete', data: userData, token: token });
        } else {
          res.status(500).json({ message: 'OTP is not correct' });
        }
        break;
      case "email": // to login with email verification code
        if (!verificationCode || !verificationCode.length) {
          return res.status(400).json({ message: 'Verification Code is required' });
        }
        const emailResponse = await verifyEmailOtp(email, verificationCode);
        if (!existingUser.is_profile_verified) {
          existingUser.is_profile_verified = true
        }
        await existingUser.save();
        if (emailResponse) {
          await sendMail({
            to: existingUser.email,
            subject: 'Logged in for bozzmail successful.',
            text: `You have successfully logged in for bozzmail`,
            heading: 'Signin Success',
            content: `<p>Congrats! You have successfully logged in for Bozzmail.</p>`
          })
          if (existingUser.notify_mobile && existingUser.phoneNumber) {
            await sendSMS({
              phoneNumber: existingUser.phoneNumber,
              message: `Congrats! You have successfully logged in for Bozzmail.`
            })
          }
          res.status(200).json({ message: 'Verification Complete', data: userData, token: token });
        } else {
          res.status(500).json({ message: 'Verification Code is not valid or expired.' });
        }
        break;
      default:
        res.status(500).json({ message: 'Something went wrong.' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};


const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await fetchUserByEmail(email);
    if (!existingUser || !existingUser.is_active) {
      return res.status(400).json({ message: 'Email is incorrect' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    let expiresAt = moment().add(PASSWORD_RESET_TOKEN_EXPIRE_TIME, 'hour');
    const data = {
      userId: existingUser._id,
      token: token,
      expiresAt: expiresAt
    }
    await createPasswordReset(data)
    const resetLink = `${FE_APP_BASE_URL}/verify-reset-password/${token}`
    await sendMail({
      to: existingUser.email,
      subject: 'Password Reset',
      text: `You requested for a password reset. Click on this link to reset your password: ${resetLink}`,
      heading: 'Password Reset',
      content: `<p>You requested for a password reset. Click on this <a href="${resetLink}" target="_blank">reset link</a> to reset your password.</p>`
    })
    if (existingUser.notify_mobile && existingUser.phoneNumber) {
      await sendSMS({
        phoneNumber: existingUser.phoneNumber,
        message: `<p>You requested for a password reset. Click on this <a href="${resetLink}" target="_blank">reset link</a> to reset your password.</p>`
      })
    }
    res.status(200).json({ message: 'Password Verification link sent to registered email' });
  } catch (error) {
    res.status(error.status || 500).json({ mesaage: error });
  }
};

const resetUserPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const tokenData = await fetchPasswordToken(token);
    if (!tokenData) {
      return res.status(400).json({ message: 'Token is not Valid or expired' });
    }
    if (tokenData.expiresAt < new Date()) {
      await deleteToken(tokenData._id)
      return res.status(400).json({ message: 'Token expired. Please request a new password reset.' });
    }
    const userData = await fetchUserById(tokenData.userId)
    if (!userData) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await updateUserPassword(userData._id, newPassword)
    await deleteToken(tokenData._id)
    await sendMail({
      to: userData.email,
      subject: 'Account Password reset successfuly',
      text: `You have successfully changed your password`,
      heading: 'Password successfully changed',
      content: `<p>Your password for your account has been reset successfully.</p>`
    })
    if (userData.notify_mobile && userData.phoneNumber) {
      await sendSMS({
        phoneNumber: userData.phoneNumber,
        message: `Your password for your account has been reset successfully.`
      })
    }
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const sendSMSVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const response = await sendSMSVerificationOTP(phoneNumber);
    if (response.data) {
      res.status(200).json({ message: 'Verification code sent', data: response.data });
    } else {
      res.status(500).json({ message: 'Failed to send verification code' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.errors });
  }
};

const verifySMSCode = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    if (!otp || !otp.length) {
      return res.status(400).json({ message: 'OTP Code is required' });
    }
    const response = await verifySMSOTP(phoneNumber, otp);
    if (response.data && response.data.response_code === 'accepted') {
      res.status(200).json({ message: 'Verification Complete', data: response.data });
    } else {
      res.status(500).json({ error: 'OTP code is not correct' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.errors });
  }
}

const verifyEmailAddress = async (req, res) => {
  const { emailId } = req.body;
  try {
    if (!emailId || !emailId.length) {
      return res.status(400).json({ message: 'Email Id is required' });
    }
    const response = await verifyEmailId(emailId);
    if (response.data) {
      res.status(200).json({ message: 'Verification complete', data: response.data });
    } else {
      res.status(500).json({ message: 'Email is not valid' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

const sentVerificationEmailCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email Address not found' });
    }
    const existingToken = await fetchOtp(email)
    const otpDetails = existingToken ? await updateOtpDetails(email) : await saveOtpDetails(email);
    await sendMail({
      to: existingUser.email,
      subject: 'Email Verification Code',
      text: `You requested for a email verification code.`,
      heading: 'Verify your profile',
      content: `<p>You requested for a email verifcation. The OTP for your account is ${otpDetails.otp}. These is valid upto 5 min</p>`
    })
    res.status(200).json({ message: 'Email Verification code sent on registered email', data: otpDetails });
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

const googleLoginSuccess = async (req, res) => {
  if (req.user && req.user._id) {
    const token = createToken(req.user._id);
    await sendMail({
      to: req.user.email,
      subject: 'Login successful in bozzmail',
      text: `Successful login `,
      heading: 'Logged in Bozzmail',
      content: `<p>You have successful logged in for bozzmail.</p>`
    })
    res.status(200).json({ message: "User login", data: req.user, token: token })
  } else {
    res.status(400).json({ message: "Not authorized" })
  }
}

const telegramLoginSuccess = async (req, res) => {
  const { first_name, last_name, id } = req.body;
  try {
    const user = await findUserByTelegramId(id)
    if (user) {
      const token = createToken(user._id);
      res.status(200).json({ message: "User login", data: user, token: token })
    }
    const data = {
      telegramId: id,
      fullName: `${first_name} ${last_name}`,
      is_profile_verified: true
    }
    const newUser = await createNewUser(data)
    const token = createToken(newUser._id);
    await sendTelegramSms({
      id: id,
      message: `Welcome to bozzmail. Your account has been created successfully.`
    })
    res.status(200).json({ message: "User login", data: newUser, token: token })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.errors });
  }
}

const logout = async (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err) }
  })
}

module.exports = {
  sendSMSVerificationCode,
  verifySMSCode,
  verifyEmailAddress,
  signUp,
  signIn,
  sendResetPasswordLink,
  resetUserPassword,
  sentVerificationEmailCode,
  googleLoginSuccess,
  telegramLoginSuccess,
  logout
};
