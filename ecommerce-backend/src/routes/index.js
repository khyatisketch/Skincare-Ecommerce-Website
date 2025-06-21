const trimRequest = require('trim-request');
const { error } = require('../config/messages')

class Routes {
    constructor(app) {
        this.app = app;
    }

    // creating app Routes starts
    appRoutes() {
        this.app.use('/auth', trimRequest.all, require("./auth"));
        this.app.use('/categories', trimRequest.all, require("./categories"));
        this.app.use('/products', trimRequest.all, require("./products"));
        this.app.use('/order', trimRequest.all, require("./order"));
        this.app.use('/payments', trimRequest.all, require("./payments"));
        this.app.use('/webhook', trimRequest.all, require("./webhook"));
        this.app.use('/coupons', trimRequest.all, require("./coupons"));


        this.app.use((req, res) => _handleResponse(req, res, { statusCode: error.InvalidApiRoute.statusCode,code: error.InvalidApiRoute.code, message: error.InvalidApiRoute.message }, null))

    }

    routesConfig() {
        this.appRoutes();
    }
}

module.exports = Routes 