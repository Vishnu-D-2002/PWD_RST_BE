const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
