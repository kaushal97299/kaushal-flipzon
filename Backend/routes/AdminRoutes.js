const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // ✅ Fix: Needed for OTP
const admin = require("../models/Admin");

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "default_secret"; // ✅ Use ENV variable

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let otpDatabase = {};
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

// 🔒 Middleware to Protect Routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 📝 Signup (password stored as-is, not safe)
app.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, role, gender } = req.body;

    const existingUser = await admin.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new admin({ name, email, phone, password, role, gender });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔐 Login
app.post("/Adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await admin.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔐 Get Profile (Protected)
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await admin.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📧 Send OTP
app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const otp = crypto.randomInt(100000, 999999);
  const otpTimestamp = Date.now();
  otpDatabase[email] = { otp, timestamp: otpTimestamp };

  const mailOptions = {
    from: `Flipzon <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address - Flipzon",
    html: `
      <div style="padding: 20px; font-family: Arial;">
        <h2>Flipzon Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #002db3;">${otp}</h1>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent successfully", otpSentAt: otpTimestamp });
  });
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, enteredOtp } = req.body;

  if (!otpDatabase[email]) {
    return res.status(400).json({ message: "OTP not found for this email" });
  }

  const { otp, timestamp } = otpDatabase[email];

  if (Date.now() - timestamp > OTP_EXPIRY_TIME) {
    delete otpDatabase[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (parseInt(enteredOtp) === otp) {
    delete otpDatabase[email];
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});




module.exports = app;
