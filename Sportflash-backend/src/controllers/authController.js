const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('📝 Registration attempt for:', email);

        // Normalize email
        const normalizedEmail = email?.trim().toLowerCase();
        console.log('   Normalized email:', normalizedEmail);

        // Check if user exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        console.log('✅ Creating new user:', email);
        console.log('🔑 Password before hashing:', password);

        // Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password
        });

        console.log('✅ User created successfully:', email);
        console.log('🔑 Password after hashing:', user.password);

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('🔴 Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt for:', email);
        console.log('   Raw email:', JSON.stringify(email));
        console.log('   Raw password:', JSON.stringify(password));

        // Normalize email
        const normalizedEmail = email?.trim().toLowerCase();
        console.log('   Normalized email:', normalizedEmail);

        // Validate email & password
        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password field)
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ User found:', email);
        console.log('🔑 Stored password hash:', user.password);
        console.log('🔑 Provided password:', password);

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        console.log('🔍 Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ Login successful for:', email);

        // Update last login (without triggering password re-hash)
        await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    preferences: user.preferences
                },
                token
            }
        });
    } catch (error) {
        console.error('🔴 Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const { favoriteTeams, favoriteSports, notifications } = req.body;

        const user = await User.findById(req.user.id);

        if (favoriteTeams) user.preferences.favoriteTeams = favoriteTeams;
        if (favoriteSports) user.preferences.favoriteSports = favoriteSports;
        if (notifications !== undefined) user.preferences.notifications = notifications;

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log('🔑 Forgot password request for:', email);

        // Normalize email
        const normalizedEmail = email?.trim().toLowerCase();

        // Find user
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Don't reveal if user exists or not (security best practice)
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();

        // Save user with reset token
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:8081'}/reset-password/${resetToken}`;

        console.log('✅ Reset token generated for:', email);
        console.log('🔗 Reset URL:', resetUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`
            });

            res.status(200).json({
                success: true,
                message: 'Email sent'
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }

    } catch (error) {
        console.error('🔴 Forgot password error:', error);

        // Clear reset token if error
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(500).json({
            success: false,
            message: 'Error processing password reset request'
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const crypto = require('crypto');

        console.log('🔑 Reset password attempt with token');

        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpire');

        if (!user) {
            console.log('❌ Invalid or expired reset token');
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        console.log('✅ Valid reset token for:', user.email);

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        console.log('✅ Password reset successful for:', user.email);

        // Generate new JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('🔴 Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};
