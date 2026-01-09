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
            sport: String,
            team: String,
            teamId: String,
            image: String
        }],
        notifications: {
            type: Boolean,
            default: true
        }
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
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('🔐 comparePassword called');
    console.log('   Candidate:', candidatePassword);
    console.log('   Stored:', this.password);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('   Result:', result);
    return result;
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
