const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const PasswordReset = require('../models/PasswordReset');
const sendEmail = require('../utils/email');

const loginRouter = require('express').Router();

loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const payload = {
            username: user.username,
            id: user._id,
        };

        const token = jwt.sign(payload, JWT_SECRET);

        res.status(200).json({
            message: 'Login successful',
            token,
            name: user.name,
            username: user.username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

loginRouter.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ username: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const randomString = Math.random().toString(36).substring(7);

        await PasswordReset.create({
            email,
            randomString,
        });

        const resetLink = `http://localhost:3000/login/reset-password?email=${email}&randomString=${randomString}`;

        await sendEmail({
            email,
            subject: 'Password Reset',
            message: `Click the following link to reset your password: ${resetLink}`,
        });

        res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

loginRouter.post('/complete-reset', async (req, res) => {
    try {
        const { email, randomString, newPassword } = req.body;

        const passwordResetData = await PasswordReset.findOne({ email, randomString });

        if (!passwordResetData) {
            return res.status(401).json({ error: 'Invalid random string' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { username: email },
            { $set: { passwordHash: hashedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await PasswordReset.deleteOne({ email, randomString });

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = loginRouter;
