require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('StepUp E-commerce API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Stats route moved to orderRoutes or kept simple
app.get('/api/stats', async (req, res) => {
    try {
        const User = require('./models/User');
        const Order = require('./models/Order');
        const totalUsers = await User.countDocuments();
        const activeOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });
        const revenueResult = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
        res.json({ 
            revenue: revenueResult[0]?.total || 0, 
            activeOrders, 
            totalUsers, 
            conversion: 4.5 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 5001; // Hardcode to ensure it uses 5001 
console.log('STARTING_ON_5001...');

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SYSTEM_ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED_REJECTION:', err.message);
});

console.log('ATTEMPTING_TO_LISTEN_ON_5001...');
const server = app.listen(PORT, () => {
    console.log(`[${new Date().toLocaleTimeString()}] SERVER_STATUS: ONLINE_AND_READY`);
});

process.on('uncaughtException', (err) => {
    console.error('FATAL_UNCAUGHT_EXCEPTION:', err.message);
    process.exit(1);
});

server.on('error', (err) => {
    console.error('SERVER_FATAL_ERROR:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy. Please close other servers.`);
    }
});
