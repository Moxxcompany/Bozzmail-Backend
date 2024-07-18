const emailTemplate = ({
  content
}) => {
    return `<html>
      <head>
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
          ${content}
        </div>
      </body>
    </html>
  `
}

module.exports = {
  emailTemplate
}