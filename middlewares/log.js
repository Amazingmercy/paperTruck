// middleware/logMiddleware.js
require('dotenv').config()
const Log = require('../models/logModel')
const baseUrl = process.env.BASE_URL


const logMiddleware = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const action = `${req.method} ${req.url}`;
        
        // Create and save the log
        await Log.create({
            userId,
            action,
        });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = logMiddleware;
