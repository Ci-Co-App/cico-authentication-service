const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 


exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Cek apakah semua field terisi
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Pastikan password adalah string
        if (typeof password !== "string") {
            return res.status(400).json({ message: "Invalid password format. Must be a string." });
        }

        // Cek apakah email sudah ada
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists. Please use a different email." });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const photo_profile = `https://ui-avatars.com/api/?name=${name}&background=random`;

        // Buat user baru
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            photo_profile
        });

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Email already exists. Please use a different email." });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        // Check if user is inactive
        if (user.status === "inactive") {
            return res.status(403).json({ message: "Your account is inactive. Contact support for assistance." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30m' }
        );

        res.status(200).json({ message: "Login successful", token, role: user.role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getMe = async (req, res) => {
    res.json({ user: req.user });
};

exports.logout = (req, res) => {
    res.json({ message: 'User logged out' });
};
