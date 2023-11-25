const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const PasswordReset = require('../models/PasswordReset');
const nodemailer = require('nodemailer');
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
            return res.status(401).json({ error: 'Invalid  password' });
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
    
        const { username } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const randomString = Math.random().toString(36).substring(7);

        await PasswordReset.create({
            email:username,
            randomString,
        });

        const transporter=nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: '143.lovvable@gmail.com',
            pass: 'fnmxhibtwjgdzajq'
        },
    })

    const message = {
        from: '143.lovvable@gmail.com',
        to: user.username,
        subject: 'Password Reset',
        text:`You are requested to change the password of user login ,So please enter this otp key = ${randomString}`
    }

    transporter.sendMail(message, (err, info) => {
        if (err) {
            res.status(404).json({ message: "something went wrong,try again !" });
        }
        res.status(200).json({ message: "Email sent " + info });
    })
    
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
