require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');

class Server {
  constructor() {
    this.app = express();

    // ✅ Ngrok browser warning header
    this.app.use((req, res, next) => {
      res.header("ngrok-skip-browser-warning", "1");
      next();
    });

    // ✅ Secure CORS Setup
    const allowedOrigins = [
      'http://localhost:3000',
      'https://skincare-ecommerce-website.vercel.app',
      'https://skincare-ecommerce-website.onrender.com',
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    this.app.use(cors(corsOptions));

    // ✅ Preflight OPTIONS requests
    this.app.options('/', cors(corsOptions));

    // ✅ Body parsers after CORS
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  includeRoutes() {
    new Routes(this.app).routesConfig();
  }

  startTheServer() {
    const port = process.env.SERVER_PORT || 4044;
    const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

    this.http.listen(port, host, () => {
      console.log(`🚀 Listening on port: ${port}`);
    });
  }
}

module.exports = new Server();
