const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.post('/admin/coupons', verifyJWT, authorizeAdmin, couponController.createCoupon);
router.post('/checkout/applyCoupon', verifyJWT, couponController.applyCoupon);



module.exports = router;
