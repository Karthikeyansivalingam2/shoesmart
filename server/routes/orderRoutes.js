const express = require('express');
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    assignDelivery,
    getAdminStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.put('/:id/status', protect, authorize('admin', 'delivery'), updateOrderStatus);
router.put('/:id/assign', protect, authorize('admin'), assignDelivery);

module.exports = router;
