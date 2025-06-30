const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyJWT} = require('../utils/authMiddleware')
const { upload } = require('../middleware/cloudinary');

router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.put('/update-profile', verifyJWT,upload.single('profileImage'), authController.updateProfile);
router.get('/me', verifyJWT, authController.getUser)
module.exports = router;
