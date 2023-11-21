const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    createdAt: {
        type: Date,
        default:Date.now
    },
    updatedAt:Date
});

const User = mongoose.model('User', userSchema);
module.exports = { User };