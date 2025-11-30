const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validation');

// Submit application
router.post('/', validateApplication, async (req, res) => {
    try {
        const applicationData = req.body;

        // Save application to database
        const result = await db.run(
            `INSERT INTO applications 
             (business_name, owner_name, owner_email, business_address, business_phone, ein, 
              monthly_revenue, credit_request, purpose, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                applicationData.businessName,
                applicationData.ownerName,
                applicationData.ownerEmail,
                applicationData.businessAddress || null,
                applicationData.businessPhone || null,
                applicationData.ein || null,
                applicationData.monthlyRevenue || null,
                applicationData.creditRequest,
                applicationData.purpose || null
            ]
        );

        res.status(201).json({
            id: result.id,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all applications (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const applications = await db.all(
            `SELECT * FROM applications ORDER BY submitted_at DESC`
        );
        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get application by ID (admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const application = await db.get(
            'SELECT * FROM applications WHERE id = ?',
            [req.params.id]
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Approve application (admin only) - creates merchant account
router.post('/:id/approve', authenticate, requireAdmin, async (req, res) => {
    try {
        const { approvedAmount, notes } = req.body;
        const applicationId = req.params.id;

        // Get application
        const application = await db.get(
            'SELECT * FROM applications WHERE id = ?',
            [applicationId]
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ error: 'Application already processed' });
        }

        // Update application status
        await db.run(
            `UPDATE applications SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP, 
             reviewed_by = ?, notes = ? WHERE id = ?`,
            [req.user.id, notes || null, applicationId]
        );

        // Create user and merchant (in production, send email with temporary password)
        const bcrypt = require('bcryptjs');
        const tempPassword = 'TempPass' + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create user
        const userResult = await db.run(
            `INSERT INTO users (email, password, name, company, role, status) 
             VALUES (?, ?, ?, ?, 'merchant', 'pending')`,
            [application.owner_email, hashedPassword, application.owner_name, application.business_name]
        );

        // Create merchant
        const merchantResult = await db.run(
            `INSERT INTO merchants (user_id, approved_amount, credit_limit, current_balance) 
             VALUES (?, ?, ?, 0)`,
            [userResult.id, approvedAmount || application.credit_request, approvedAmount || application.credit_request]
        );

        res.json({
            message: 'Application approved and merchant account created',
            merchantId: merchantResult.id,
            tempPassword: tempPassword // In production, send via email
        });
    } catch (error) {
        console.error('Approve application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reject application (admin only)
router.post('/:id/reject', authenticate, requireAdmin, async (req, res) => {
    try {
        const { notes } = req.body;
        const applicationId = req.params.id;

        await db.run(
            `UPDATE applications SET status = 'rejected', reviewed_at = CURRENT_TIMESTAMP, 
             reviewed_by = ?, notes = ? WHERE id = ?`,
            [req.user.id, notes || null, applicationId]
        );

        res.json({ message: 'Application rejected' });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

