const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { authenticate, requireMerchantOrAdmin } = require('../middleware/auth');

// Get messages for current user
router.get('/', authenticate, requireMerchantOrAdmin, async (req, res) => {
    try {
        let messages;
        
        if (req.user.role === 'admin') {
            // Admin can see all messages
            messages = await db.all(
                `SELECT * FROM messages ORDER BY created_at DESC`
            );
        } else {
            // Merchant can only see their own messages
            const merchant = await db.get('SELECT id FROM merchants WHERE user_id = ?', [req.user.id]);
            if (!merchant) {
                return res.json([]);
            }
            
            messages = await db.all(
                `SELECT * FROM messages WHERE merchant_id = ? ORDER BY created_at DESC`,
                [merchant.id]
            );
        }

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create message (admin to merchant)
router.post('/', authenticate, async (req, res) => {
    try {
        const { merchantId, subject, message } = req.body;

        // Only admin can send messages to merchants
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can send messages' });
        }

        const result = await db.run(
            `INSERT INTO messages (merchant_id, from_role, subject, message) 
             VALUES (?, 'admin', ?, ?)`,
            [merchantId, subject, message]
        );

        res.status(201).json({
            id: result.id,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark message as read
router.put('/:id/read', authenticate, requireMerchantOrAdmin, async (req, res) => {
    try {
        const messageId = req.params.id;

        // Check if user owns the message
        if (req.user.role === 'merchant') {
            const merchant = await db.get('SELECT id FROM merchants WHERE user_id = ?', [req.user.id]);
            const message = await db.get('SELECT merchant_id FROM messages WHERE id = ?', [messageId]);
            
            if (!message || message.merchant_id !== merchant.id) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        await db.run(
            'UPDATE messages SET read = 1 WHERE id = ?',
            [messageId]
        );

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

