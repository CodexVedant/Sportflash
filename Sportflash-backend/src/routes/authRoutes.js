const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const {
    register,
    verifyOtp,
    login,
    getMe,
    updatePreferences,
    savePushToken,
    logout,
    forgotPassword,
    verifyResetOtp, // New
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 10 }).withMessage('Name must not exceed 10 characters')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only alphabets'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/verify-otp', verifyOtp);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyresetotp', verifyResetOtp); // New
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.put('/pushtoken', protect, savePushToken);
router.post('/logout', protect, logout);

module.exports = router;
