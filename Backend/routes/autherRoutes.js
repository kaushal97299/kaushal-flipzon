const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, "../ProfileImage");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let otpDatabase = {};
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
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
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #002db3; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Flipzon</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <img src="https://i.ibb.co/d0vhSHN8/logo-removebg-preview.png" alt="Verify Icon" width="60" style="margin-bottom: 20px;" />
          <h2>Verify Your Email Address</h2>
          <p style="font-size: 16px; color: #444;">Verify your email to finish signing up with Flipzon. Use the following verification code:</p>
          <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #002db3;">${otp}</div>
          <p style="color: #888;">The verification code is valid for 5 minutes.</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666;">
          For any queries or concerns, feel free to contact us by replying to this email.
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending OTP", error });
    } else {
      res.status(200).json({
        message: "OTP sent successfully",
        otpSentAt: otpTimestamp,
      });
    }
  });
});

app.post("/verify-otp", (req, res) => {
  const { email, enteredOtp } = req.body;
  if (!otpDatabase[email]) {
    return res.status(400).json({ message: "OTP not found for this email" });
  }

  const { otp, timestamp } = otpDatabase[email];
  const currentTime = Date.now();
  if (currentTime - timestamp > OTP_EXPIRY_TIME) {
    delete otpDatabase[email];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (otp === parseInt(enteredOtp)) {
    res.status(200).json({ message: "OTP Verified successfully" });
    delete otpDatabase[email];
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, role, gender } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });

    const newUser = await User.create({ name, email, phone, password, role, gender });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const userData = user.toObject();
    delete userData.password;
    res.json({ message: "Login successful", token, user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        password: "google-login-secret", // Dummy password
        role: "user",                    // ✅ required field
        gender: "other",                 // ✅ required field
      });
      await user.save();
      console.log("✅ New Google user saved");
    } else {
      console.log("✅ Existing Google user found");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ success: true, user: userData, token });

  } catch (error) {
    console.error("❌ Google login error:", error); // Enable this for debugging
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "❌ User not found" });
    res.status(200).json({ message: "✅ User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete User", error: error.message });
  }
});

app.post("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/profileupdate", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, dob, address } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, email, phone, dob, address },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    user.profileImage = req.file ? `ProfileImage/${req.file.filename}` : user.profileImage;
    await user.save();
    res.status(200).json({ message: "✅ User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update User", error: error.message });
  }
});

module.exports = app;
