require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use("/api/cico/auth", require("./routes/authRoutes"));

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to API Auth");
});

// Ensure the database is connected before starting the server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully!");
        await sequelize.sync();
        console.log("✅ Database Synced");

        // Start the server after database connection
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1); // Exit the app if DB fails to connect
    }
};

startServer();
