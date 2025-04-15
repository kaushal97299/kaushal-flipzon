const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "user"], required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob:{type:Date,},
    address: { type: String, },
    profileImage: { type: String,},
    isVerified: { type: Boolean, default: true},

    // OTP fields
    otp: { type: String, select: false }, // OTP stored securely
    otpExpires: { type: Date, select: false }, // OTP expiration time
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
