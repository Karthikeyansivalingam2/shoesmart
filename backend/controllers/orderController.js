const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'yourkeyhere',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'yoursecrethere'
});

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, phone, paymentMethod } = req.body;
        const isDummyMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('yourkeyhere');
        
        let order;
        if (paymentMethod === 'Online') {
            let razorpayOrderId;
            
            if (isDummyMode) {
                // Mock Razorpay Order
                razorpayOrderId = `order_mock_${Date.now()}`;
            } else {
                // Real Razorpay Order
                const options = {
                    amount: totalAmount * 100, // Amount in paise
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`
                };
                const razorpayOrder = await razorpay.orders.create(options);
                razorpayOrderId = razorpayOrder.id;
            }

            order = await Order.create({
                customer: req.user._id,
                items,
                totalAmount,
                shippingAddress,
                phone,
                paymentMethod,
                razorpayOrderId: razorpayOrderId,
                status: 'Pending'
            });

            return res.status(201).json({
                orderId: order._id,
                razorpayOrderId: razorpayOrderId,
                amount: totalAmount * 100,
                key: process.env.RAZORPAY_KEY_ID,
                isMock: isDummyMode
            });
        } else {
            // COD Order
            order = await Order.create({
                customer: req.user._id,
                items,
                totalAmount,
                shippingAddress,
                phone,
                paymentMethod,
                status: 'Placed',
                paymentStatus: 'Pending'
            });

            // Update Stock for COD
            for (const item of items) {
                if (mongoose.Types.ObjectId.isValid(item.product)) {
                    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
                }
            }

            return res.status(201).json(order);
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isDummyMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('yourkeyhere');

        let isValid = false;

        if (isDummyMode) {
            isValid = true; // Skip verification in dummy mode
        } else {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
            isValid = expectedSignature === razorpay_signature;
        }

        if (isValid) {
            const order = await Order.findById(orderId);
            order.paymentStatus = 'Paid';
            order.status = 'Placed';
            order.paymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
            await order.save();

            // Update Stock
            for (const item of order.items) {
                if (mongoose.Types.ObjectId.isValid(item.product)) {
                    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
                }
            }

            res.json({ message: 'Payment successful', order });
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const assignDelivery = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            deliveryPerson: req.body.deliveryPersonId,
            assignedAt: new Date()
        }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        const orders = await Order.find({ status: 'Delivered' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            totalProducts,
            totalOrders,
            totalCustomers,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    assignDelivery,
    getAdminStats
};
