const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {
  fetchUserByEmail,
  createNewUser,
  getUserData,
  fetchUserById,
  updateUserPassword
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
  sendMobileVerificationOTP,
  verifyMobileOTP
} = require('../../services/telynxServices');
const {
  verifyEmailId
} = require('../../services/infobipServices')

const signUp = async (req, res) => {
  const { email, password, phoneNumber } = req.body;
  try {
    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: { email: 'Email Address already in use' } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      email,
      password: hashedPassword,
      phoneNumber
    };
    const user = await createNewUser(data)
    const userData = await getUserData(user)
    if (user) {
      res.status(200).json({ message: 'User created Successfully', data: userData });
    } else {
      res.status(500).json({ message: 'Failed to create a new user' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const signIn = async (req, res) => {
  const { email, otp, password } = req.body;
  const action = req.params.action;
  try {
    const existingUser = await fetchUserByEmail(email, true);
    if (!existingUser || !existingUser.is_active) {
      return res.status(400).json({ message: { error: 'Email is incorrect' } });
    }
    const token = createToken(existingUser._id);
    const userData = await getUserData(existingUser)
    switch (action) {
      case 'request':
        res.status(200).json({ data: userData });
        break;
      case 'password':
        if (!password || !password.length) {
          return res.status(400).json({ message: { error: 'Password is required' } });
        }
        if (!existingUser.password) {
          return res.status(400).json({ message: { error: 'Password is not stored. Try Different method' } });
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
          return res.status(400).json({ message: { error: 'Email or password is incorrect' } });
        }
        res.status(200).json({ message: 'User successfully logged in', data: userData, token: token });
        break;
      case "otp":
        if (!otp || !otp.length) {
          return res.status(400).json({ error: 'OTP Code is required' });
        }
        const response = await verifyMobileOTP(existingUser.phoneNumber, otp);
        if (!existingUser.is_profile_verified) {
          existingUser.is_profile_verified = true
        }
        await existingUser.save();
        if (response.data && response.data.response_code === 'accepted') {
          res.status(200).json({ message: 'Verification Complete', data: userData, token: token });
        } else {
          res.status(500).json({ error: 'OTP is not correct' });
        }
        break;
      case "email":
        if (!otp || !otp.length) {
          return res.status(400).json({ error: 'OTP Code is required' });
        }
        const emailResponse = await verifyEmailOtp(email, otp);
        if (!existingUser.is_profile_verified) {
          existingUser.is_profile_verified = true
        }
        await existingUser.save();
        if (emailResponse) {
          res.status(200).json({ message: 'Verification Complete', data: userData, token: token });
        } else {
          res.status(500).json({ error: 'OTP is not valid or expired.' });
        }
        break;
      default:
        res.status(500).json({ error: 'URL is not Valid.' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};


const sendPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await fetchUserByEmail(email);
    if (!existingUser || !existingUser.is_active) {
      return res.status(400).json({ message: { error: 'Email is incorrect' } });
    }
    const token = crypto.randomBytes(32).toString('hex');
    let expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    const data = {
      userId: existingUser._id,
      token: token,
      expiresAt: expiresAt
    }
    await createPasswordReset(data)
    const resetLink = `http:localhost:3000/verify-reset-password/${token}`
    sendMail({
      to: existingUser.email,
      subject: 'Password Reset',
      text: `You requested for a password reset. Click on this link to reset your password: ${resetLink}`,
      title: 'Password reset token',
      subheading: 'Password Reset',
      content: `<p>You requested for a password reset. Click on this <a href="${resetLink}">reset link</a> to reset your password.</p>`
    })
    res.status(200).json({ message: 'Password Verification link sent on registered email' });
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const resetUserPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const tokenData = await fetchPasswordToken(token);
    if (!tokenData) {
      return res.status(400).json({ message: { error: 'Token is not Valid or expired' } });
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
    res.status(200).json({ message: 'Password Changed successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const sendMobileVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const response = await sendMobileVerificationOTP(phoneNumber);
    if (response.data) {
      res.status(200).json({ message: 'Verification code sent', data: response.data });
    } else {
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.errors });
  }
};

const verifyMobileCode = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!otp || !otp.length) {
      return res.status(400).json({ error: 'OTP Code is required' });
    }
    const response = await verifyMobileOTP(phoneNumber, otp);
    if (response.data && response.data.response_code === 'accepted') {
      res.status(200).json({ message: 'Verification Complete', data: response.data });
    } else {
      res.status(500).json({ error: 'OTP code is not correct' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.errors });
  }
}

const verifyEmailAddress = async (req, res) => {
  const { emailId } = req.body;
  try {
    if (!emailId || !emailId.length) {
      return res.status(400).json({ error: 'Email Id is required' });
    }
    const response = await verifyEmailId(emailId);
    if (response.data) {
      res.status(200).json({ message: 'Verification Complete', data: response.data });
    } else {
      res.status(500).json({ error: 'Email is not valid' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

const sentVerificationEmailCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: { email: 'Email Address not found' } });
    }
    const existingToken = await fetchOtp(email)
    const otpDetails = existingToken ? await updateOtpDetails(email) : await saveOtpDetails(email);
    sendMail({
      to: existingUser.email,
      subject: 'Email Verification Code',
      text: `You requested for a email verification code.`,
      title: 'Email verification code',
      subheading: 'Verify your profile',
      content: `<p>You requested for a email verifcation. The OTP for your account is ${otpDetails.otp}. These is valid upto 5 min</p>`
    })
    res.status(200).json({ message: 'Email Verification code sent on registered email', data: otpDetails });
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
}

const googleLoginSuccess = async (req, res) => {
  if (req.user) {
    const token = createToken(req.user._id);
    res.status(200).json({ message: "user Login", data: req.user, token: token })
  } else {
    res.status(400).json({ message: "Not Authorized" })
  }
}

const logout = async (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err) }
  })
}

module.exports = {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress,
  signUp,
  signIn,
  sendPasswordLink,
  resetUserPassword,
  sentVerificationEmailCode,
  googleLoginSuccess,
  logout
};
