const nodemailer = require("nodemailer")
const {
  NODEMAILER_FROM_EMAIL_ID,
  NODEMAILER_FROM_EMAIL_PASSWORD,
} = require("../constant/constants")
const { emailTemplate } = require("./emailTemplate")

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: NODEMAILER_FROM_EMAIL_ID,
    pass: NODEMAILER_FROM_EMAIL_PASSWORD,
  },
})

const sendMail = async ({ to, subject, text, content }) => {
  const mailOptions = {
    from: NODEMAILER_FROM_EMAIL_ID,
    to: to,
    subject: subject,
    text: text,
    html: emailTemplate({
      content: content,
    }),
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}

module.exports = {
  sendMail,
}
