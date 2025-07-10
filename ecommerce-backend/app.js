require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');

class Server {
  constructor() {
    this.app = express();

    // ✅ Define allowed origins
   // ✅ Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://skincare-ecommerce-website.vercel.app',
  'https://skincare-ecommerce-website.onrender.com',
];

// ✅ Middleware to handle CORS manually
this.app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed =
    allowedOrigins.includes(origin) ||
    (origin && origin.endsWith('.vercel.app')); // ✅ Allow preview deployments

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});


    // ✅ Apply express.json AFTER CORS
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Optional: Skip ngrok warning
    this.app.use((req, res, next) => {
      res.header('ngrok-skip-browser-warning', '1');
      next();
    });

    this.http = http.Server(this.app);
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  includeRoutes() {
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
    const { startKeepAlivePing } = require('./src/utils/keepAlive');
startKeepAlivePing();
  }
}

module.exports = new Server();
