const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
    try {
        console.log(req.cookies);
        const token = req.cookies?.jwt;
        if (!token) return next();

        const jwtData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(jwtData.id).select('-password -__v');

        if (!req.user) return next();

        req.user = req.user.toObject();
        req.user._id = req.user._id.toString();
        next();
    } catch (e) {
        res.status(401).json({error: "Invalid token"});
    }
}


async function protect(req, res, next) {
    try {
        await authenticate(req, res, () => {
            if (!req.user) {
                return res.status(401).json({ error: 'Provide correct token via Bearer authorization' });
            }
            next();
        });
    } catch (e) {
        return res.status(401).json({ error: e.message });
    }
}


async function adminProtect(req, res, next) {
    try {
        await authenticate(req, res, async () => {
            const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    redirect: "http://localhost:5173/login",
                    error: "Unauthorized access",
                });
            }

            if (req.user.role !== "admin") {
                return res.status(403).json({ error: "Only admins can access this resource" });
            }

            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}



module.exports = {protect, authenticate, adminProtect};