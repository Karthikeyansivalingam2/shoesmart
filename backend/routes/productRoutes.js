const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, authorize('admin'), addProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
