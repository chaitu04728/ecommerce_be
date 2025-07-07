const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure emails are unique
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: { // For differentiating between regular users and admins
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Only hash if password was modified
        next();
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;