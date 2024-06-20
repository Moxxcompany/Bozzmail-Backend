const { sendMobileVerificationCode } = require('../services/authServices');

const sendMobileVerificationCodeHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const response = await sendMobileVerificationCode(phoneNumber);
    if (response.data) {
      res.status(200).json({ message: 'Verification code sent', data: response.data });
    } else {
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sending verification code' });
  }
};

module.exports = { 
  sendMobileVerificationCode: sendMobileVerificationCodeHandler 
};
