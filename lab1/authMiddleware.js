const jwt = require("jsonwebtoken")
const JWT_SECRET = "randomstringthatisgeneratedinterminalviassl"

async function protect(req, res, next) {
    try {
        const token = req.cookies?.jwt;
        if (!token) throw new Error('provide correct token via Bearer authorization');

        const jwtData = jwt.verify(token, JWT_SECRET);
        if (!jwtData) throw new Error('provide correct token via Bearer authorization');

        req.user = jwtData;
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({error: "Invalid token"});
    }
}

module.exports = protect;
