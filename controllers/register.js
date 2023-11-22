const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
    try {
        const { username, name, password } = req.body;

        // Hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            name,
            passwordHash,
        });

        await user.save();
        res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = userRouter;
