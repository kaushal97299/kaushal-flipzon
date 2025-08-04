const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: {
      type: String,
      // phone is optional now
      // unique: true, // ← Don't add unique unless enforced
      sparse: true, // <- only indexes if present (good for optional)
    },

    password: { type: String }, // ✅ optional for Google users

    googleId: { type: String }, // ✅ used in Google login

    role: {
      type: String,
      enum: ["client", "user"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false, // ✅ optional for Google login
    },

    dob: { type: Date },
    address: { type: String },
    profileImage: { type: String },

    isVerified: { type: Boolean, default: true },

    // OTP fields
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
