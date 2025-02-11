const express = require('express')
const cookieParser = require("cookie-parser")
const protect = require('./authMiddleware')
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = 3000
const JWT_SECRET = "randomstringthatisgeneratedinterminalviassl"

function getUserData() {
    return {id: 777, name: "Chuck Norris", email: "gmail@chucknorris.com"}
}

app.get("/get_token", (req, res) => {
    const token = jwt.sign(getUserData(), JWT_SECRET, {expiresIn: '1h'})
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 3600000
    }).json({status: "ok"})
})

app.get('/api/profile', protect, (req, res) => {
    res.json(getUserData())
})

module.exports = {app, getUserData, JWT_SECRET}


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}
