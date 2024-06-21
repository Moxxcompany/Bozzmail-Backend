const {
  sendMobileVerificationCode,
  verifyMobileOTP
} = require('../services/telynxServices');
const {
  verifyEmailId
} = require('../services/infobipServices')

const sendMobileVerificationCodeHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    if (!phoneNumber || !phoneNumber.length) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const response = await sendMobileVerificationCode(phoneNumber);
    if (response.data) {
      res.status(200).json({ message: 'Verification code sent', data: response.data });
    } else {
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.errors });
  }
};

const verifyMobileCodeHandler = async (req, res) => {
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
  sendMobileVerificationCode: sendMobileVerificationCodeHandler,
  verifyMobileCode: verifyMobileCodeHandler,
  verifyEmailAddress
};
