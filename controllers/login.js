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
            return res.status(401).json({ error: 'Invalid username' });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const payload = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(payload, JWT_SECRET);

        res.status(200).json({ message: 'Login successful', token, name: user.name, username: user.username });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Password reset endpoint
loginRouter.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username:email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a random string for password reset
        const randomString = Math.random().toString(36).substring(7);

        // Save the random string in the PasswordReset collection
        await PasswordReset.create({
            email,
            randomString,
        });

        // Construct the reset link
        const resetLink = `http://localhost:3000/login/reset-password?email=${email}&randomString=${randomString}`;

        // Send an email with a link containing the random string
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


module.exports = loginRouter;
