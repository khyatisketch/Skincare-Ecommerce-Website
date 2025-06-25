class Routes {
    constructor(app) {
        this.app = app;
    }

    appRoutes() {
        try {
            console.log('🔁 Registering /auth routes...');
            this.app.use('/auth', trimRequest.all, require("./auth"));
        } catch (err) {
            console.error('❌ Error in /auth route:', err);
        }

        try {
            console.log('🔁 Registering /categories routes...');
            this.app.use('/categories', trimRequest.all, require("./categories"));
        } catch (err) {
            console.error('❌ Error in /categories route:', err);
        }

        try {
            console.log('🔁 Registering /products routes...');
            this.app.use('/products', trimRequest.all, require("./products"));
        } catch (err) {
            console.error('❌ Error in /products route:', err);
        }

        try {
            console.log('🔁 Registering /order routes...');
            this.app.use('/order', trimRequest.all, require("./order"));
        } catch (err) {
            console.error('❌ Error in /order route:', err);
        }

        try {
            console.log('🔁 Registering /payments routes...');
            this.app.use('/payments', trimRequest.all, require("./payments"));
        } catch (err) {
            console.error('❌ Error in /payments route:', err);
        }

        try {
            console.log('🔁 Registering /webhook routes...');
            this.app.use('/webhook', trimRequest.all, require("./webhook"));
        } catch (err) {
            console.error('❌ Error in /webhook route:', err);
        }

        try {
            console.log('🔁 Registering /coupons routes...');
            this.app.use('/coupons', trimRequest.all, require("./coupons"));
        } catch (err) {
            console.error('❌ Error in /coupons route:', err);
        }

        // catch-all
        this.app.use((req, res) =>
            _handleResponse(req, res, {
                statusCode: error.InvalidApiRoute.statusCode,
                code: error.InvalidApiRoute.code,
                message: error.InvalidApiRoute.message,
            }, null)
        );
    }

    routesConfig() {
        this.appRoutes();
    }
}

module.exports = Routes;
