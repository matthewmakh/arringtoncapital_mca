const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/database');
const { authenticate, requireAdmin, requireMerchantOrAdmin } = require('../middleware/auth');
const { validateMerchant } = require('../middleware/validation');

// Get all merchants (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const merchants = await db.all(`
            SELECT 
                u.id, u.email, u.name, u.company, u.status, u.created_at,
                m.id as merchant_id, m.approved_amount, m.credit_limit, m.current_balance
            FROM users u
            LEFT JOIN merchants m ON u.id = m.user_id
            WHERE u.role = 'merchant'
            ORDER BY u.created_at DESC
        `);

        res.json(merchants);
    } catch (error) {
        console.error('Get merchants error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current merchant's own data (must come before /:id)
router.get('/me', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const merchant = await db.get(`
            SELECT 
                u.id, u.email, u.name, u.company, u.status, u.created_at,
                m.id as merchant_id, m.approved_amount, m.credit_limit, m.current_balance
            FROM users u
            JOIN merchants m ON u.id = m.user_id
            WHERE u.id = ?
        `, [req.user.id]);

        if (!merchant) {
            return res.status(404).json({ error: 'Merchant account not found' });
        }

        res.json(merchant);
    } catch (error) {
        console.error('Get merchant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get merchant by ID (admin only - must come after /me)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const merchantId = req.params.id;

        const merchant = await db.get(`
            SELECT 
                u.id, u.email, u.name, u.company, u.status, u.created_at,
                m.id as merchant_id, m.approved_amount, m.credit_limit, m.current_balance
            FROM users u
            JOIN merchants m ON u.id = m.user_id
            WHERE m.id = ?
        `, [merchantId]);

        if (!merchant) {
            return res.status(404).json({ error: 'Merchant not found' });
        }

        res.json(merchant);
    } catch (error) {
        console.error('Get merchant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create merchant (admin only)
router.post('/', authenticate, requireAdmin, validateMerchant, async (req, res) => {
    try {
        const { email, name, company, approvedAmount, password, status } = req.body;

        // Check if user already exists
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userResult = await db.run(
            `INSERT INTO users (email, password, name, company, role, status) 
             VALUES (?, ?, ?, ?, 'merchant', ?)`,
            [email, hashedPassword, name, company, status || 'pending']
        );

        // Create merchant record
        const merchantResult = await db.run(
            `INSERT INTO merchants (user_id, approved_amount, credit_limit, current_balance) 
             VALUES (?, ?, ?, 0)`,
            [userResult.id, approvedAmount, approvedAmount]
        );

        res.status(201).json({
            id: userResult.id,
            merchantId: merchantResult.id,
            message: 'Merchant created successfully'
        });
    } catch (error) {
        console.error('Create merchant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update merchant (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const merchantId = req.params.id;
        const { email, name, company, approvedAmount, status } = req.body;

        // Get merchant
        const merchant = await db.get('SELECT user_id FROM merchants WHERE id = ?', [merchantId]);
        if (!merchant) {
            return res.status(404).json({ error: 'Merchant not found' });
        }

        // Update user
        if (email || name || company || status) {
            const updates = [];
            const params = [];

            if (email) { updates.push('email = ?'); params.push(email); }
            if (name) { updates.push('name = ?'); params.push(name); }
            if (company) { updates.push('company = ?'); params.push(company); }
            if (status) { updates.push('status = ?'); params.push(status); }
            updates.push('updated_at = CURRENT_TIMESTAMP');

            params.push(merchant.user_id);
            await db.run(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                params
            );
        }

        // Update merchant
        if (approvedAmount !== undefined) {
            await db.run(
                `UPDATE merchants 
                 SET approved_amount = ?, credit_limit = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [approvedAmount, approvedAmount, merchantId]
            );
        }

        res.json({ message: 'Merchant updated successfully' });
    } catch (error) {
        console.error('Update merchant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get merchant transactions (current merchant or admin viewing specific merchant)
router.get('/transactions', authenticate, requireMerchantOrAdmin, async (req, res) => {
    try {
        let merchantId;

        if (req.user.role === 'admin') {
            merchantId = req.query.merchantId;
            if (!merchantId) {
                return res.status(400).json({ error: 'merchantId query parameter required for admin' });
            }
        } else {
            // Get merchant's own transactions
            const merchant = await db.get('SELECT id FROM merchants WHERE user_id = ?', [req.user.id]);
            if (!merchant) {
                return res.json([]);
            }
            merchantId = merchant.id;
        }

        const transactions = await db.all(
            `SELECT * FROM transactions WHERE merchant_id = ? ORDER BY created_at DESC`,
            [merchantId]
        );

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Request funds (merchant - uses their own account)
router.post('/funds', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { amount, description } = req.body;

        // Get merchant account
        const merchant = await db.get('SELECT id, credit_limit, current_balance FROM merchants WHERE user_id = ?', [req.user.id]);
        if (!merchant) {
            return res.status(404).json({ error: 'Merchant account not found' });
        }

        const available = merchant.credit_limit - merchant.current_balance;
        if (amount > available) {
            return res.status(400).json({ error: `Amount exceeds available credit. Available: $${available.toLocaleString()}` });
        }

        // Create transaction
        await db.run(
            `INSERT INTO transactions (merchant_id, type, amount, description, status) 
             VALUES (?, 'draw', ?, ?, 'pending')`,
            [merchant.id, amount, description || 'Fund request']
        );

        // Update balance (for demo - in production, this would be approved first)
        await db.run(
            `UPDATE merchants SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [amount, merchant.id]
        );

        res.json({ message: 'Fund request submitted successfully' });
    } catch (error) {
        console.error('Fund request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

