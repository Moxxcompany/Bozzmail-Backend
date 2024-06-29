const nodemailer = require("nodemailer");

const NODEMAILER_FROM_EMAIL_ID = process.env.NODEMAILER_FROM_EMAIL_ID
const NODEMAILER_FROM_EMAIL_PASSWORD = process.env.NODEMAILER_FROM_EMAIL_PASSWORD

if (
  !NODEMAILER_FROM_EMAIL_ID ||
  !NODEMAILER_FROM_EMAIL_PASSWORD
) {
  throw new Error('Environment variables for nodemailer are not set.');
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: NODEMAILER_FROM_EMAIL_ID,
    pass: NODEMAILER_FROM_EMAIL_PASSWORD,
  },
});

const sendMail = async ({
  to,
  subject,
  text,
  title,
  subheading,
  content
}) => {

  const mailOptions = {
    from: NODEMAILER_FROM_EMAIL_ID,
    to: to,
    subject: subject,
    text: text,
    html: `<html>
      <head>
        <title>${title}</title>
        <style>
          body{
            height : 100%;
            display : flex;
            flex-direction : column;
            justify-content : center;
            align-items : center;
          }
          .container{
            width : 100vw;
            height : 400px;
            border-radius : 2px;
            background-color : #fff;
            box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
          }
          .btn{
            border : none;
            padding : 10px 20px;
            border-radius : 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${subheading}</h2>
          ${content}
        </div>
      </body>
    
    </html>
    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports={
  sendMail
}