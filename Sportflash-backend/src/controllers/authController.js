const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('📝 Registration attempt for:', email);

        const normalizedEmail = email?.trim().toLowerCase();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const now = Date.now();
        const otpExpire = new Date(now + 10 * 60 * 1000); // 10 minutes

        console.log(`⏰ Time Debug: Now=${now} (${new Date(now).toISOString()}), Expire=${otpExpire.toISOString()}`);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            otp,
            otpExpire,
            isVerified: false
        });

        // Send OTP Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'SportFlash - Verify Your Email',
                message: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
                html: `<h1>Welcome to SportFlash! 🏏⚽🏀</h1>
                       <p>Please verifying your email address using the code below:</p>
                       <h2 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h2>
                       <p>This code expires in 10 minutes.</p>`
            });
            console.log(`✅ OTP sent to ${user.email}`);
        } catch (err) {
            console.error('❌ Email sending failed:', err);
            // Optionally delete user or allow retry
        }

        res.status(201).json({
            success: true,
            requireOtp: true,
            email: user.email,
            message: 'Verification code sent to email'
        });

    } catch (error) {
        console.error('🔴 Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`🔐 Verifying OTP for: ${email}, Code: ${otp}`);

        const user = await User.findOne({ email: email?.toLowerCase() }).select('+otp +otpExpire');

        if (!user) {
            console.log('❌ Verify Failed: User not found');
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        console.log(`👤 User Found: ${user.email}, Stored OTP: ${user.otp}, Expire: ${user.otpExpire}`);

        // If already verified, return success immediately (Handle double-clicks)
        if (user.isVerified) {
            console.log('✅ User already verified. Returning success.');
            const token = generateToken(user._id);
            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isVerified: true
                    },
                    token
                }
            });
        }

        if (user.otp !== otp) {
            console.log(`❌ Verify Failed: OTP Mismatch (Expected: ${user.otp}, Received: ${otp})`);
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        if (user.otpExpire < Date.now()) {
            console.log(`❌ Verify Failed: OTP Expired. Now=${Date.now()}, Expire=${user.otpExpire.getTime()}`);
            return res.status(400).json({ success: false, message: 'Verification code expired' });
        }

        // Validate success
        user.isVerified = true;
        user.otp = null;       // Changed from undefined
        user.otpExpire = null; // Changed from undefined
        await user.save();

        // Generate Token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: true
                },
                token
            }
        });

    } catch (error) {
        console.error('🔴 Verification error:', error);
        res.status(500).json({ success: false, message: error.message });
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
        const { favoriteTeams, favoriteSports, favoritePlayers, notifications, favoriteLeagues } = req.body;

        const user = await User.findById(req.user.id);

        if (favoriteTeams) {
            // Sanitize: convert legacy string IDs to objects
            user.preferences.favoriteTeams = favoriteTeams.map(t => {
                if (typeof t === 'string') return { id: t };
                return t;
            });
        }
        if (favoriteSports) user.preferences.favoriteSports = favoriteSports;
        if (favoritePlayers) {
            user.preferences.favoritePlayers = favoritePlayers.map(p => {
                if (typeof p === 'string') return { id: p, name: 'Unknown', sport: 'football' };

                // Sanitization
                if (p.image_path && !p.image) p.image = p.image_path;

                // Handle Team Object and ID
                if (p.team && typeof p.team === 'object') {
                    p.teamId = p.team.id;
                    p.team = p.team.name || 'Unknown';
                }

                return p;
            });
        }
        if (favoriteLeagues) user.preferences.favoriteLeagues = favoriteLeagues;
        if (notifications !== undefined) user.preferences.notifications = notifications;
        if (req.body.followedMatches) user.preferences.followedMatches = req.body.followedMatches;

        // Handle Global Settings (Email, Sports Toggles)
        if (req.body.globalSettings) {
            // Merge deeper to avoid overwriting unrelated nested keys if possible, 
            // but for now simple overwrite of keys is fine if frontend sends full object or we merge manually.
            // Mongoose mixed types can be tricky.
            // Let's assume frontend sends the partials it wants to update, 
            // but we should probably merge with existing to be safe?
            // Actually, frontend sends: { ...globalSettings, [key]: newValue } so it sends the "new full state".
            // So overwriting is safe IF frontend sends the complete object.
            // But if frontend only sends partial, we might lose data. 
            // My frontend code sends: `const newGlobalSettings = { ...globalSettings, [key]: newValue };` (FULL OBJECT)
            // So user.preferences.globalSettings = req.body.globalSettings is safe.
            user.preferences.globalSettings = {
                ...user.preferences.globalSettings, // Spread existing (mongoose object) to be safe
                ...req.body.globalSettings
            };
        }

        console.log('✅ Saving updated preferences for user:', user._id);
        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update push token
// @route   PUT /api/auth/pushtoken
// @access  Private
exports.savePushToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        await User.findByIdAndUpdate(req.user.id, { pushToken: token });

        res.status(200).json({ success: true, message: 'Push token updated' });
    } catch (error) {
        console.error('Error updating push token:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout user / Clear Push Token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { pushToken: null });
        console.log('✅ User logged out, push token cleared:', req.user.id);
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Forgot Password - Send Reset Email
// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and save
        const crypto = require('crypto');
        user.resetPasswordOtp = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save({ validateBeforeSave: false });

        const message = `
            You have requested a password reset. 
            Your Verification Code is: \n\n ${otp} \n\n 
            This code will expire in 10 minutes.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });

            res.status(200).json({ success: true, data: 'OTP sent to email' });
        } catch (err) {
            console.error('Email Send Error:', err);
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify Reset OTP & Return Reset Token
// @route   POST /api/auth/verifyresetotp
exports.verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        const crypto = require('crypto');
        const resetPasswordOtp = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email: normalizedEmail,
            resetPasswordOtp,
            resetPasswordOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // OTP Verified. Now generate a secure token for use in resetPassword
        // This reuses the existing method which generates a token and sets expiry
        const resetToken = user.getResetPasswordToken();

        // Clear OTP fields
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: 'OTP Verified',
            resetToken // Send this to frontend to pass to resetPassword
        });

    } catch (error) {
        console.error('Verify Reset OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
exports.resetPassword = async (req, res) => {
    try {
        const crypto = require('crypto');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password updated success'
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// End of file
