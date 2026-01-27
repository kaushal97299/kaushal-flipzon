const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const router = express.Router();

router.use(express.json());
router.use(cors());

/* =========================
   FILE UPLOAD SETUP
========================= */
const uploadDir = path.join(__dirname, "../ProfileImage");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* =========================
   EMAIL SETUP
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, role, gender } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    await User.create({
      name,
      email,
      phone,
      password, // ⚠️ plain text
      role,
      gender,
      isVerified: true,
      loginType: "normal",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({ message: "Login successful", token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GOOGLE LOGIN
========================= */
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        role: "user",
        gender: "other",
        isVerified: true,
        password: "GOOGLE_LOGIN",
        loginType: "google",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Google login failed" });
  }
});

/* =========================
   GET USERS
========================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

/* =========================
   DELETE USER
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PROFILE UPDATE
========================= */
router.post("/profileupdate", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, dob, address } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, dob, address },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      user.profileImage = `ProfileImage/${req.file.filename}`;
      await user.save();
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `https://kaushal-flipzon.netlify.app/resetpassword/${token}`;

    await transporter.sendMail({
      from: `Flipzon <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<a href="${resetLink}">Reset Password</a>`,
    });

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // plain text
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
