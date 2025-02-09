const express = require("express");
const {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
} = require("../controllers/adminUsers.js");
const {adminProtect} = require("../middleware/auth");

const router = express.Router();

// Get all users
router.get("/users", adminProtect, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Add a new user
router.post("/add", adminProtect, async (req, res) => {
    const {name, email, role} = req.body;

    const password = "12345678"
    if (!name || !email || !role) {
        return res.status(400).json({error: "Missing required fields: name, email, password, role"});
    }

    try {
        const user = await createUser(name, email, password, role);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

// Edit user
router.put("/edit/:id", adminProtect, async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Delete user
router.delete("/delete/:id", adminProtect, async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(200).json({message: "User deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
