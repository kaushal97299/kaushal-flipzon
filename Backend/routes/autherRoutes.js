const express = require("express");
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const User =require("../models/user")
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

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../ProfileImage"); 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),  // Upload images to the 'uploads' directory
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),  // Append timestamp to the file name    
});
const upload = multer({ storage });
 // Store securely in environment variables
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
let otpDatabase = {}; 
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
// Endpoint to send OTP to the user's email
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const cleanEmail = email.toLowerCase();
    const otp = crypto.randomInt(100000, 999999).toString();

    otpDatabase[cleanEmail] = {
      otp,
      timestamp: Date.now(),
    };

    await transporter.sendMail({
      from: `Flipzon <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your Flipzon Verification Code",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing:6px">${otp}</h1>
          <p>Valid for 5 minutes</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "OTP failed" });
  }
});


 
// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, enteredOtp } = req.body;
  const cleanEmail = email.toLowerCase();

  const record = otpDatabase[cleanEmail];

  if (!record) {
    return res.status(400).json({ message: "OTP not found. Please resend." });
  }

  // expiry check
  if (Date.now() - record.timestamp > OTP_EXPIRY_TIME) {
    delete otpDatabase[cleanEmail];
    return res.status(400).json({ message: "OTP expired" });
  }

  // 🔥 STRING comparison (MOST IMPORTANT)
  if (String(record.otp) !== String(enteredOtp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // success
  delete otpDatabase[cleanEmail]; // one-time use
  res.status(200).json({ success: true, message: "OTP verified" });
});

// **User Registration Route**



// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, role, gender } = req.body;
    console.log(req.body);
     
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });

    const Newuser = await User.create({ name, email, phone, password, role, gender }); // Storing password as plain text (⚠️ Not Secure)
    console.log("new user",Newuser);
    // await Newuser.save();
   
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("error",error);
    res.status(500).json({ error: error.message });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, Role: user.role },process.env.JWT_SECRET, { expiresIn: "1h" });
     const userData= user.toObject();
    delete userData.password; // Exclude password from response
    res.json({ 
      message: "Login successful", 
      token, 
      user:userData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Google Login Route**
app.post("/google-login", async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: "Missing email or Google ID" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google user with minimal required fields + dummy password
      user = new User({
        email,
        name,
        googleId,
        isVerified: true,
        role: "user",
        gender: "other",
        password: "GOOGLE_USER_DUMMY_PASSWORD", // ✅ dummy password
        loginType: "google", 
      });

      await user.save();
      console.log("✅ New Google user created:", user.email);
    } else {
      console.log("✅ Google user logged in:", user.email);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ success: true, user: userData, token });

  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get('/users', async (req, res) => {
  try {
      const users = await User.find({}).select('-password');
      res.json({
          success: true,
          users
      });
  } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching users'
      });
  }
});
app.delete("/:id", async (req, res) => {
  try {
    const order = await User.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ User not found" });
    }
    res.status(200).json({ message: "✅ User deleted successfully", order });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete User", error: error.message });
  }
});
// **User Profile Route (POST)**
app.post("/profile",  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authMiddleware = require("../middleware/auth");
 
app.post("/profileupdate",upload.single("profileImage"),async (req, res) => {
  try {
    const { name, email, phone, dob, address} = req.body;
    console.log("req.body",req.body);
    const user = await User.findOneAndUpdate({email}, { name, email, phone, dob, address }, { new: true });  // Use the ID from the decoded token
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }  
    console.log("user",user);
    user.profileImage = req.file ? `ProfileImage/${req.file.filename}` : null; // Save the file name in the database
    user.save()
    res.status(200).json({ message: "✅ User updated successfully", user });
  } catch (error) {
console.log("error",error); 
    res.status(500).json({ message: "❌ Failed to update User", error: error.message });
  } });

  // Send Reset Password Link via Email
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Send Email
    const resetLink = `https://kaushal-flipzon.netlify.app/resetpassword/${resetToken}`; // Frontend link
    await transporter.sendMail({
      from: `Flipzon <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Flipzon Password Reset Link",
      html: `
        <h2>Password Reset Requested</h2>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Reset Password using Token
app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // (Optional: hash password in production)
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = app