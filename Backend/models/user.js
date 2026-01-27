const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String, // optional for Google users
    },

    googleId: {
      type: String, // optional for normal users
    },

    role: {
      type: String,
      enum: ["client", "user"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dob: {
      type: Date,
    },

    address: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: true, // since no OTP, user is verified directly
    },

    loginType: {
      type: String,
      enum: ["normal", "google"],
      default: "normal",
    },

    // Forgot password fields
    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
