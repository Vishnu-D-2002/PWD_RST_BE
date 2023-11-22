const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('passwordHash')) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
