const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { verifyJWT, authenticateJWT, authorizeAdmin } = require('../utils/authMiddleware')

router.get('/dashboard', verifyJWT, authorizeAdmin, adminDashboardController.getDashboardData);

module.exports = router;