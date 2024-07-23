const nodemailer = require("nodemailer")
const {
  NODEMAILER_FROM_EMAIL_ID,
  NODEMAILER_FROM_EMAIL_PASSWORD,
} = require("../constant/constants")
const ejs = require('ejs');
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: NODEMAILER_FROM_EMAIL_ID,
    pass: NODEMAILER_FROM_EMAIL_PASSWORD,
  },
})

const sendMail = async ({ subject, text, content, user, template }) => {
  try {
    ejs.renderFile(path.join(__dirname, `../templates/${template ? template : 'default'}.ejs`), { content, user }, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        const mailOptions = {
          from: NODEMAILER_FROM_EMAIL_ID,
          to: user.email,
          subject: subject,
          text: text,
          html: data,
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      }
    });

  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  sendMail,
}
