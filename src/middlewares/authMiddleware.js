const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user from database
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user = user; // Attach user object to request
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
