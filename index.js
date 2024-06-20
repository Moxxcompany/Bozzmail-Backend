const express = require("express")
const bodyParser = require('body-parser')
const connectDB = require('./src/config/database') 
require('dotenv').config()
const authRoutes = require('./src/routes/auth')
const app = express()

connectDB()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/auth', authRoutes)

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});