const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')


router.post('/webhook', express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

module.exports = router;