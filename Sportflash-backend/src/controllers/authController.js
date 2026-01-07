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
