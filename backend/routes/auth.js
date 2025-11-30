const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');
const { validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Login
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user from database
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Your account is not active. Please contact support.' });
        }

        // Get merchant data if user is a merchant
        let merchant = null;
        if (user.role === 'merchant') {
            merchant = await db.get(
                `SELECT m.* FROM merchants m WHERE m.user_id = ?`,
                [user.id]
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                role: user.role,
                status: user.status
            },
            merchant: merchant
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = req.user;
        let merchant = null;

        if (user.role === 'merchant') {
            merchant = await db.get(
                `SELECT m.* FROM merchants m WHERE m.user_id = ?`,
                [user.id]
            );
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                role: user.role,
                status: user.status
            },
            merchant: merchant
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout (client-side token removal, but we can track if needed)
router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;

