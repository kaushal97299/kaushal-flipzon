const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: {
      type: String,
      sparse: true, // optional unique index
    },

    password: { type: String }, // optional for Google users

    googleId: { type: String, required: false }, // Optional for normal login

    role: {
      type: String,
      enum: ["client", "user"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },

    dob: { type: Date },
    address: { type: String },
    profileImage: { type: String },

    isVerified: { type: Boolean, default: true },

    loginType: { type: String, enum: ["normal", "google"], default: "normal" }, // ✅ Add comma here

    // OTP fields
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    // ✅ Forgot password fields
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
