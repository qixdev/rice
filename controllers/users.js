const User = require('../models/User');

async function getUserByEmail(email) {
    return User.findOne({email});
}

async function registerUser(email, password) {
    const user = await User.create({email, password, role: "user", balance: 100000});
    // User schema uses bcrypt under the hood if you go to definition of the schema(pre-save method)
    return {token: user.generateToken()};
}


async function loginUser(email, password) {
    const user = await User.findOne({email: email});
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password); // this method uses bcrypt under the hood
    if (!isMatch) throw new Error('Invalid credentials');
    return {token: user.generateToken(), role: user.role};
}

/* Pretty complex functionality and not needed for a basic MVP, Rusya probably will do it TODO*/

// async function updateUser(userId, userData) {}


async function getUserProfile(userId) {
    const user = await User.findById(userId).select('-password -__v');
    if (!user) throw new Error('user not found');
    return user;
}

async function changeUserBalance(userId, amount, session = null) {
    let query = User.findById(userId);
    if (session) query = query.session(session);
    const user = await query;
    if (!user) throw new Error('User not found');
    console.log(user);
    console.log(amount);
    user.balance = (user.balance || 0) + amount; // ensure balance is initialized
    await user.save();
    return user.balance;
}

module.exports = {registerUser, loginUser, getUserProfile, getUserByEmail, changeUserBalance};
