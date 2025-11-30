const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Login validation
const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Merchant creation validation
const validateMerchant = [
    body('email').isEmail().normalizeEmail(),
    body('name').notEmpty().trim(),
    body('company').notEmpty().trim(),
    body('approvedAmount').isFloat({ min: 10000 }).withMessage('Minimum approved amount is $10,000'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];

// Application validation
const validateApplication = [
    body('businessName').notEmpty().trim(),
    body('ownerName').notEmpty().trim(),
    body('ownerEmail').isEmail().normalizeEmail(),
    body('creditRequest').isFloat({ min: 10000 }).withMessage('Minimum credit request is $10,000'),
    handleValidationErrors
];

module.exports = {
    validateLogin,
    validateMerchant,
    validateApplication,
    handleValidationErrors
};

