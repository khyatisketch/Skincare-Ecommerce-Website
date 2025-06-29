const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.put('/update-profile', verifyJWT, authController.updateProfile);

module.exports = router;
