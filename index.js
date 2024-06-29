const express = require("express")
const cors = require("cors");
const bodyParser = require('body-parser')
const session = require("express-session");
const connectDB = require('./src/config/database')
require('dotenv').config()
const authRoutes = require('./src/routes/auth')
const userRoutes = require('./src/routes/user')
const paymentMethodsRoute = require('./src/routes/paymentMethods')
const shipmentsRoutes = require('./src/routes/shipments')
const jwtMiddlewareValidation = require('./src/middleware/validateToken')
const PASSPORT_SESSION_SECRET = process.env.PASSPORT_SESSION_SECRET

const app = express()

const startServer = async () => {
  try {
    await connectDB();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({
      origin: "http://localhost:3001",
      methods: "GET,POST,PUT,DELETE",
      credentials: true
    }));
    app.use(session({
      secret: PASSPORT_SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    }))

    //routes
    app.use('/auth', authRoutes)
    app.use('/user', jwtMiddlewareValidation, userRoutes)
    app.use('/payment-methods', paymentMethodsRoute)
    app.use('/shipments', shipmentsRoutes)
    const port = process.env.PORT || '3001';
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();