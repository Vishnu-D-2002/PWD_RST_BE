const User = require('../models/user');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
loginRouter.post('/', async (req, res) => {
    
    const { username, password } = req.body;
    const users = await User.findOne({ username });
    if (!users) {
        res.status(404).json({ message: "user not found" });
    }

    const authenticate = await bcrypt.compare(password, users.passwordHash);
    if (!authenticate) {
        res.status(404).json({ message: "password wrong" });
    }

    const payload = {
        username: users.username,
        id:users._id
    }

    const token=jwt.sign(payload,JWT_SECRET)
     res.json({
            message:'password is correct',token, username: users.username, name: users.name
        })
    
});

module.exports = loginRouter;