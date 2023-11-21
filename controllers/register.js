const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

userRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;
    const passwordHash = bcrypt.hash(password, 10);

    const user = new User({
        username,
        name,
        passwordHash
    });
    await user.save();
    res.status(200).json({ message: "User created successfully", user });
});

module.exports = { userRouter };