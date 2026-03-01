const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper to read users
const getUsers = () => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            fs.writeFileSync(usersFilePath, '[]');
            return [];
        }
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
};

// Helper to save users
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error saving users file:', err);
    }
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const users = getUsers();

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: 'USR' + Date.now(),
            name,
            email,
            password: hashedPassword,
            role: role || 'customer',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers();

        // Support for hardcoded admin/delivery if needed
        let user = users.find(u => u.email === email);

        if (!user) {
            // Check for hardcoded admin/delivery for easy testing
            if (email === 'admin' && password === 'admin123') {
                user = { id: 'ADM001', name: 'Super Admin', email: 'admin@stepup.com', role: 'admin' };
            } else if (email === 'delivery' && password === 'delivery123') {
                user = { id: 'DLV001', name: 'Vikram Delivery', email: 'delivery@stepup.com', role: 'delivery' };
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // For hardcoded users, we just return a token directly without bcrypt check
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ token, user });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
