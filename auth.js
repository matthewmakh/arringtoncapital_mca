const jwt = require('jsonwebtoken');
const db = require('../models/database');

// Verify JWT token
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is not active' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Check if user is merchant or admin
const requireMerchantOrAdmin = (req, res, next) => {
    if (req.user.role !== 'merchant' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = {
    authenticate,
    requireAdmin,
    requireMerchantOrAdmin
};

