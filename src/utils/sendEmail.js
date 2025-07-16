const nodemailer = require("nodemailer")
const {
  NODEMAILER_FROM_EMAIL_ID,
  NODEMAILER_FROM_EMAIL_PASSWORD,
} = require("../constant/constants")
const ejs = require('ejs');
const path = require("path");
const { logger } = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: NODEMAILER_FROM_EMAIL_ID,
    pass: NODEMAILER_FROM_EMAIL_PASSWORD,
  },

  // For the Devlopment and Testing phase...
  tls: {
    rejectUnauthorized: false
  }
})

const sendMail = async ({ subject, text, content, user, template }) => {
  try {
    const html = await new Promise((resolve, reject) => {
      ejs.renderFile(path.join(__dirname, `../templates/${template ? template : 'default'}.ejs`), { content, user }, (err, data) => {
        if (err) {
          logger.error({ message: 'Failed to send email', error: err })
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const mailOptions = {
      from: NODEMAILER_FROM_EMAIL_ID,
      to: user.email,
      subject: subject,
      text: text,
      html: html,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error({ message: 'Failed to send email', error: error })
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
    return true;
  } catch (error) {
    logger.error({ message: 'Failed to send email', error: error.message });
    return false;
  }
};

module.exports = {
  sendMail,
}
