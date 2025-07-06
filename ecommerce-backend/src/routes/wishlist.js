const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.post('/addWishlist', verifyJWT, wishlistController.addToWishlist);
router.delete('/:productId', verifyJWT, wishlistController.removeFromWishlist);
router.get('/getWishlist', verifyJWT, wishlistController.getWishlist);


module.exports = router;
