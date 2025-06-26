const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.post('/admin/coupons', verifyJWT, authorizeAdmin, couponController.createCoupon);
router.put('/admin/coupons/:id', verifyJWT, authorizeAdmin, couponController.updateCoupon);
router.get('/admin/coupons', verifyJWT, authorizeAdmin, couponController.getAllCoupons);
router.delete('/admin/coupons/:id',  verifyJWT, authorizeAdmin, couponController.deleteCoupon);
router.post('/checkout/applyCoupon', verifyJWT, couponController.applyCoupon);



module.exports = router;
