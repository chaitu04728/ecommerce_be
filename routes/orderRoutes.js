// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth'); // Import your auth middleware

// /api/orders routes
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders); // POST for creating, GET for admin viewing all
router.route('/myorders').get(protect, getMyOrders); // GET for a logged-in user's orders
router.route('/:id').get(protect, getOrderById); // GET a specific order by ID
router.route('/:id/pay').put(protect, updateOrderToPaid); // PUT for marking order as paid
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // PUT for marking order as delivered (admin only)

module.exports = router;