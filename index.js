const mongoose = require('mongoose');
const express = require('express');
const { MONGODB_URI, PORT } = require('./utils/config')
const {info,err}=require('./utils/logger')
const app = express();
const cors = require('cors');
const { userRouter } = require('./controllers/register');
app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI)
    .then(() => {
        info("connected to MONGODB ...");
        app.listen(PORT, () => {
            info(`Server is running at http://localhost:${PORT}`);
        })
    })
    .catch((error)=> {
        err("error", error)
    });

app.use('/user', userRouter);