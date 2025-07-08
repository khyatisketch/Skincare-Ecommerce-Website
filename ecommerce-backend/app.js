require('dotenv').config();

/* eslint-disable no-console */
const cors = require('cors');
const express = require('express');
const http = require('http');

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');
// const webhookRouter = require('./src/routes/webhook'); // Uncomment if needed

class Server {
  constructor() {
    this.app = express();

    // ✅ Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://skincare-ecommerce-website.vercel.app',
      'https://skincare-ecommerce-website.onrender.com',
    ];

    // ✅ Configure CORS
    const corsOptions = {
      origin: function (origin, callback) {
        console.log('🔍 Incoming Origin:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log('⛔ Not allowed by CORS:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    // ✅ Apply CORS middleware globally
    this.app.use(cors(corsOptions));

    // ✅ Custom preflight (OPTIONS) response handler
    this.app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
      }
      next();
    });

    // ✅ Optional: skip ngrok browser warning
    this.app.use((req, res, next) => {
      res.header('ngrok-skip-browser-warning', '1');
      next();
    });

    // ✅ Body parsers AFTER CORS
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  includeRoutes() {
    // Optional webhook route
    // this.app.use('/webhook', webhookRouter);

    new Routes(this.app).routesConfig();
  }

  startTheServer() {
    this.appConfig();
    this.includeRoutes();

    const port = process.env.PORT || 4044;
    const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

    this.http.listen(port, host, async () => {
      console.log(`🚀 Server is listening on port: ${port}`);
    });
  }
}

module.exports = new Server();
