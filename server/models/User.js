// server/models/User.js
const mongoose = require('mongoose');

// --- SECURITY WARNING ---
// Storing passwords in plain text is extremely insecure.
// This is for educational purposes only. In a real application,
// you MUST hash passwords using a library like bcrypt.js.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favoriteMatches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);