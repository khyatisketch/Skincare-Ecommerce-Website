require('dotenv').config();

/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const cors = require('cors');

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');
const webhookRouter = require('./src/routes/webhook');

class Server {
  constructor() {
    this.app = express();

    // Middleware to skip Ngrok browser warning
    this.app.use((req, res, next) => {
      res.header("ngrok-skip-browser-warning", "1");
      next();
    });

    // Body parsers
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // ✅ CORS Setup
    const allowedOrigins = [
      'http://localhost:3000',
      'https://skincare-ecommerce-website.vercel.app',
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
      credentials: true,
    };

    this.app.use(cors(corsOptions));

    // // Handle preflight (OPTIONS) requests globally
    // this.app.options('*', cors(corsOptions));

    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  includeRoutes() {
    // You can include webhookRouter here if needed
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
