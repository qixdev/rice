const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next();
        const jwtData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(jwtData.id).select('-password -__v');
        if (!req.user) return next();
        req.user = req.user.toObject(); // Convert Mongoose document to plain object
        req.user._id = req.user._id.toString();
        next();
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

async function protect(req, res, next) {
    try {
        // Call authenticate to populate req.user if possible
        await authenticate(req, res, () => {
            if (!req.user) {
                throw new Error('provide correct token via Bearer authorization');
            }
        });
        next();
    } catch (e) {
        res.status(401).json({error: e.message});
    }
}

async function adminProtect(req, res, next) {
    try {
        if (!req.user) {
            throw new Error('provide correct token via Bearer authorization');
        }
        if (req.user.username != 'danial') {
            throw new Error('provide correct token via Bearer authorization');
        }
        next();
    } catch (e) {
        res.status(401).json({error: e.message});
    }
}

module.exports = {protect, authenticate, adminProtect};