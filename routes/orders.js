const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ORDERS_FILE = path.join(__dirname, '../orders.json');

// Helper to read orders
const getOrders = () => {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to save orders
const saveOrders = (orders) => {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

// Create a new order (Checkout)
router.post('/', (req, res) => {
    try {
        const orderData = req.body;
        const orders = getOrders();

        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'Pending',
            ...orderData
        };

        orders.push(newOrder);
        saveOrders(orders);

        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Get ALL orders (For Admin)
router.get('/', (req, res) => {
    const orders = getOrders();
    res.json(orders);
});

// Get orders by User Email (For User Dashboard)
router.get('/user/:email', (req, res) => {
    const orders = getOrders();
    const userOrders = orders.filter(o => o.email === req.params.email);
    res.json(userOrders);
});

// Update Order Status (Admin)
router.patch('/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id == req.params.id);

        if (orderIndex === -1) return res.status(404).json({ message: "Order not found" });

        orders[orderIndex].status = status;
        saveOrders(orders);

        res.json({ message: "Status updated", status });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
});

// Get Single Order (For Tracking)
router.get('/:id', (req, res) => {
    const orders = getOrders();
    const order = orders.find(o => o.id == req.params.id);
    if (order) res.json(order);
    else res.status(404).json({ message: "Order not found" });
});

module.exports = router;
