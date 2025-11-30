const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models/database');
const { authenticate, requireMerchantOrAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
    },
    fileFilter: function (req, file, cb) {
        // Allow common document types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and documents are allowed.'));
        }
    }
});

// Upload file
router.post('/upload', authenticate, requireMerchantOrAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const merchantId = req.body.merchantId || null;
        const applicationId = req.body.applicationId || null;

        // If merchant, verify they're uploading their own files
        if (merchantId && req.user.role === 'merchant') {
            const merchant = await db.get('SELECT user_id FROM merchants WHERE id = ?', [merchantId]);
            if (!merchant || merchant.user_id !== req.user.id) {
                // Delete uploaded file
                fs.unlinkSync(req.file.path);
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // Save file info to database
        const result = await db.run(
            `INSERT INTO documents (merchant_id, application_id, filename, original_filename, 
             file_path, file_size, mime_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                merchantId,
                applicationId,
                req.file.filename,
                req.file.originalname,
                req.file.path,
                req.file.size,
                req.file.mimetype
            ]
        );

        res.json({
            id: result.id,
            filename: req.file.filename,
            originalFilename: req.file.originalname,
            size: req.file.size,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Get files
router.get('/', authenticate, requireMerchantOrAdmin, async (req, res) => {
    try {
        let files;

        if (req.user.role === 'admin') {
            // Admin can see all files
            files = await db.all(
                `SELECT * FROM documents ORDER BY uploaded_at DESC`
            );
        } else {
            // Merchant can only see their own files
            const merchant = await db.get('SELECT id FROM merchants WHERE user_id = ?', [req.user.id]);
            if (!merchant) {
                return res.json([]);
            }
            files = await db.all(
                `SELECT * FROM documents WHERE merchant_id = ? ORDER BY uploaded_at DESC`,
                [merchant.id]
            );
        }

        res.json(files.map(file => ({
            id: file.id,
            filename: file.original_filename,
            size: file.file_size,
            mimeType: file.mime_type,
            uploadedAt: file.uploaded_at
        })));
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Download file
router.get('/:id/download', authenticate, requireMerchantOrAdmin, async (req, res) => {
    try {
        const fileId = req.params.id;

        // Get file info
        const file = await db.get('SELECT * FROM documents WHERE id = ?', [fileId]);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check access
        if (req.user.role === 'merchant') {
            if (!file.merchant_id) {
                return res.status(403).json({ error: 'Access denied' });
            }
            const merchant = await db.get('SELECT user_id FROM merchants WHERE id = ?', [file.merchant_id]);
            if (!merchant || merchant.user_id !== req.user.id) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // Check if file exists
        if (!fs.existsSync(file.file_path)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.download(file.file_path, file.original_filename);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

module.exports = router;

