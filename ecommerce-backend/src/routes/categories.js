const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyJWT } = require('../utils/authMiddleware')

router.post('/createCategory', verifyJWT, categoryController.createCategory)
router.get('/getAllCategories', categoryController.getAllCategories)
router.put('/updateCategory/:id', verifyJWT, categoryController.updateCategory);
router.delete('/deleteCategory/:id', verifyJWT, categoryController.deleteCategory);

module.exports = router;
