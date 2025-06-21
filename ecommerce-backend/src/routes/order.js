const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.post('/createOrder', verifyJWT, orderController.createOrder);
router.get('/myOrders', verifyJWT, orderController.getMyOrders)
router.get('/allOrders', authenticateJWT, authorizeAdmin, orderController.getAllOrders);
router.put('/orders/:id/status', authenticateJWT, authorizeAdmin, orderController.updateOrderStatus);
router.put('/:id/shipping', authenticateJWT, authorizeAdmin, orderController.updateShippingInfo);
router.post('/:orderId/resendConfirmation', verifyJWT, orderController.resendOrderConfirmation);


module.exports = router;
