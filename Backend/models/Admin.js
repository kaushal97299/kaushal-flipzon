const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 }, // Minimum 8 characters
  isVerified: { type: Boolean, default: true},

  // OTP fields
  otp: { type: String, select: false }, // OTP stored securely
  otpExpires: { type: Date, select: false }, // OTP expiration time
});

module.exports = mongoose.model("Admin", AdminSchema);
