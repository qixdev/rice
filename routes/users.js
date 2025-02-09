const express = require('express');
const {registerUser, loginUser, getUserProfile, getUserByEmail, changeUserBalance} = require('../controllers/users.js');
const {protect} = require('../middleware/auth');

const router = express.Router();

// TODO: sending emails. Probably after making the UI.
router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await getUserByEmail(email);
        if (user) { // to avoid duplicates
            res.status(409).json({error: 'User already exists'});
            return
        }
        const data = await registerUser(email, password);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const data = await loginUser(email, password);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
});

router.get('/profile', protect, async (req, res) => {
    try {
        const data = await getUserProfile(req.user._id);
        return res.json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// todo - a way of selling this tokens in future
router.put('/replenish-balance', protect, async (req, res) => {
    const {tokens_to_add: tokensToAdd} = req.body;
    if (typeof tokensToAdd !== 'number' || tokensToAdd <= 0) {
        return res.status(400).json({error: 'field `tokens_to_add` must be a number greater than 0.'});
    }

    try {
        const user = req.user;
        const newBalance = await changeUserBalance(user._id, tokensToAdd);
        res.status(202).json({new_balance: newBalance});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})


module.exports = router;
