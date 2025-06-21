require('dotenv').config();

/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const cors = require('cors')

const AppConfig = require('./src/config/app-config');
const Routes = require('./src/routes');
// const { runCronJobs } = require('./utils/cronJobs')
const webhookRouter = require('./src/routes/webhook');

class Server {
    constructor() {
        this.app = express();

         // Middleware to skip Ngrok browser warning
    this.app.use((req, res, next) => {
        res.header("ngrok-skip-browser-warning", "1");
        next();
      });
  
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(cors());
        this.http = http.Server(this.app);
    }

    appConfig() {
        new AppConfig(this.app).includeConfig();
    }

    /* Including app Routes starts */
    includeRoutes() {
        // new Routes(this.app).appRoutes();
        new Routes(this.app).routesConfig();
    }
    /* Including app Routes ends */

    startTheServer() {
        this.appConfig();
        this.includeRoutes();

        const port = process.env.PORT || 4044;

        // const port = 4044;
        const host = process.env.NODE_SERVER_HOST || '0.0.0.0';

        this.http.listen(port, host, async () => {
            console.log(`Listening on port: ${port}`);
            // runCronJobs();

        });
    }
}

module.exports = new Server();