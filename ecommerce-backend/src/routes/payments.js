const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.post('/createCheckoutSession', verifyJWT, paymentController.createCheckoutSession);


module.exports = router;
