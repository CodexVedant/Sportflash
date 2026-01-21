const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    avatar: {
        type: String,
        default: null
    },
    pushToken: {
        type: String,
        default: null
    },
    preferences: {
        favoriteTeams: [{
            id: String,
            name: String,
            sport: String,
            logo: String
        }],
        favoriteSports: [{
            type: String,
            enum: ['cricket', 'football', 'basketball']
        }],
        favoritePlayers: [{
            id: String,
            name: String,
            sport: String,
            team: String,
            teamId: String,
            image: String
        }],
        notifications: {
            type: Boolean,
            default: true
        },
        globalSettings: {
            cricket: {
                wickets: { type: Boolean, default: true },
                fours: { type: Boolean, default: true },
                sixes: { type: Boolean, default: true }
            },
            football: {
                goals: { type: Boolean, default: true }
            },
            basketball: {
                points: { type: Boolean, default: true }
            },
            email_big_matches: { type: Boolean, default: false },
            email_daily_digest: { type: Boolean, default: false }
        },
        favoriteLeagues: [{
            id: String,
            name: String,
            sport: String,
            country: String,
            logo: String
        }],
        followedMatches: [String], // Array of Match IDs to strictly follow
    },
    bookmarks: [{
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],
    role: {
        type: String,
        enum: ['user', 'editor', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    otp: {
        type: String,
        select: false
    },
    otpExpire: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpire: Date
}, {
    timestamps: true
});

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to generate reset token
const crypto = require('crypto');

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('🔐 comparePassword called');
    // console.log('   Candidate:', candidatePassword); // Security risk to log plain password
    // console.log('   Stored:', this.password);
    const result = await bcrypt.compare(candidatePassword, this.password);
    // console.log('   Result:', result);
    return result;
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.resetPasswordOtp;
    delete user.resetPasswordOtpExpire;
    delete user.otp;
    delete user.otpExpire;
    return user;
};

module.exports = mongoose.model('User', userSchema);
