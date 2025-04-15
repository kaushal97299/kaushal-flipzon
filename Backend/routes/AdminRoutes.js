const express = require("express");
const jwt = require("jsonwebtoken");
const admin= require("../models/Admin")

const app = express();
const SECRET_KEY = "lkjhguhgf"; // Store securely in environment variables

// 🔹 Authentication Middleware (For Protected Routes)
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// 📌 **Signup Route** (⚠️ Stores Password in Plain Text)
app.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, role, gender } = req.body;

    let user = await admin.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    users = new admin({ name, email, phone, password, });
    await users.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 **Login Route**
app.post("/Adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await admin.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ 
      message: "Login successful", 
      token, 
      user: { name: user.name, email: user.email},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 **User Profile Route (Protected)**
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await admin.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
