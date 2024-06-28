const nodemailer = require("nodemailer");

const fromEmailId = process.env.NODEMAILER_FROM_EMAIL_ID
const fromEmailPassword = process.env.NODEMAILER_FROM_EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: fromEmailId,
    pass: fromEmailPassword,
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
    from: fromEmailId,
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