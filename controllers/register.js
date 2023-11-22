const express = require('express');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
    try {
        const { username, name, password } = req.body;

        const user = new User({
            username,
            name,
            passwordHash: password,
        });

        await user.save();
        res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = userRouter;
