const bodyParser = require('body-parser');
const ExpressConfigModule = require('./express-config');
const unhandledRejections = new Map();
class AppConfig {
    constructor(app) {
        process.on('unhandledRejection', (reason, promise) => {
            console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
            unhandledRejections.set(promise, reason);
            process.exit(1)
        });
        process.on('rejectionHandled', (promise) => {
            unhandledRejections.delete(promise);
        });
        this.app = app;
    }

    includeConfig() {
        this.loadAppLevelConfig();
        this.loadExpressConfig();
    }

    loadAppLevelConfig() {
        this.app.use(
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
        );
        require("../responseHandler");
    }

    loadExpressConfig() {
        new ExpressConfigModule(this.app).setAppEngine();
    }
}

module.exports = AppConfig;