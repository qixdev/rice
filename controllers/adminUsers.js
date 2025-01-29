const User = require("../models/User");

async function getAllUsers() {
    return User.find().select("-password -__v"); // Exclude sensitive fields
}

async function createUser(name, email, password, role) {
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = await User.create({name, email, password, role});
    return {id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role};
}

async function updateUser(userId, userData) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    Object.assign(user, userData);
    await user.save();
    return {id: user._id, name: user.name, email: user.email, role: user.role};
}

async function deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await User.deleteOne({_id: userId});
}

module.exports = {getAllUsers, createUser, updateUser, deleteUser};
