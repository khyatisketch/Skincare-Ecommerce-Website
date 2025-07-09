require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');

class Server {
  constructor() {
    this.app = express();

    // ✅ Skip ngrok browser warning
    this.app.use((req, res, next) => {
      res.header("ngrok-skip-browser-warning", "1");
      next();
    });

    // ✅ CORS Setup
    const allowedOrigins = [
      'http://localhost:3000',
      'https://skincare-ecommerce-website.vercel.app',
      'https://skincare-ecommerce-website.onrender.com',
    ];
    const corsOptions = {
      origin: function (origin, callback) {
        const allowedOrigins = [
          'http://localhost:3000',
          'https://skincare-ecommerce-website.vercel.app',
          'https://skincare-ecommerce-website.onrender.com',
        ];
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
    
    // ✅ SAFEST OPTION: Custom middleware for all OPTIONS
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
    

    // ✅ Body parsing
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
