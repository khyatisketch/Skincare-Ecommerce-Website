const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')
const { upload } = require('../middleware/cloudinary');


router.post('/createProduct', authenticateJWT, authorizeAdmin,upload.array('imageUrl', 10), productController.createProduct)
router.put('/updateProduct/:id', authenticateJWT, authorizeAdmin,upload.array('imageUrl', 10), productController.updateProduct)
router.delete('/deleteProduct/:id', authenticateJWT, authorizeAdmin, productController.deleteProduct)
router.get('/getAllProducts', productController.getAllProducts)
router.get('/product/:id', productController.getProductById);
router.get('/related/:categoryId', productController.getRelatedProducts);
router.patch('/admin/products/:id/restock', verifyJWT,  authorizeAdmin, productController.restockProduct);
router.post('/:id/reviews', verifyJWT, productController.createReview);
router.get('/:id/getReviews', productController.getProductReviews);
router.post('/avgRating', productController.getAvgRating);
router.get('/admin/reviews', verifyJWT, authorizeAdmin, productController.getReviews);
router.patch('/admin/reviews/:id/approve', verifyJWT, authorizeAdmin, productController.approveReview);
router.delete('/admin/reviews/:id', verifyJWT, authorizeAdmin, productController.deleteReview);



module.exports = router;
