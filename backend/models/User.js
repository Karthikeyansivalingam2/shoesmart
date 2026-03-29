const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'admin', 'delivery'],
        default: 'customer'
    },
    phone: { type: String },
    addresses: [{
        type: { type: String, default: 'Home' },
        address: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }],
    address: { type: String },
    avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
