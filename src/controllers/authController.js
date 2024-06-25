const bcrypt = require("bcrypt");
const {
  fetchUserByEmail,
  createNewUser,
  getUserData
} = require('../helper/user')
const {
  createToken
} = require('../utils/jwt')
const {
  sendMobileVerificationOTP,
  verifyMobileOTP
} = require('../services/telynxServices');
const {
  verifyEmailId
} = require('../services/infobipServices')

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
  const { email } = req.body;
  const action = req.params.action;
  try {
    const existingUser = await fetchUserByEmail(email);
    if (!existingUser) {
      return res.status(400).json({ message: { error: 'Email is incorrect' } });
    }
    const token = createToken(existingUser._id);
    const userData = await getUserData(existingUser)
    switch (action) {
      case 'request':
        res.status(200).json({ data: userData });
      case 'password':
        const { password } = req.body
        if (!password || !password.length) {
          return res.status(400).json({ message: { error: 'Password is required' } });
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
          return res.status(400).json({ message: { error: 'Email or password is incorrect' } });
        }
        res.status(200).json({ message: 'User successfully logged in', data: userData, token: token });
        break;
      case "otp":
        const { otp } = req.body;
        if (!otp || !otp.length) {
          return res.status(400).json({ error: 'OTP Code is required' });
        }
        const response = await verifyMobileOTP(existingUser.phoneNumber, otp);
        console.log(response)
        if (response.data && response.data.response_code === 'accepted') {
          res.status(200).json({ message: 'Verification Complete', data: userData, token: token });
        } else {
          res.status(500).json({ error: 'OTP code is not correct' });
        }
      default:
        res.status(500).json({ error: 'URL is not Valid.' });
    }
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

module.exports = {
  sendMobileVerificationCode,
  verifyMobileCode,
  verifyEmailAddress,
  signUp,
  signIn
};
