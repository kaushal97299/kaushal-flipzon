const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
    phone: { type: String, unique: true, sparse: true }, // optional for Google users

    password: { type: String  }, // optional for Google users

    role: {
      type: String,
      enum: ["client", "user"],
      // required: true,
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    dob: { type: Date },
    address: { type: String },
    profileImage: { type: String },

    isVerified: { type: Boolean, default: true },

    googleId: { type: String }, // <-- ✅ for Google users

    // OTP fields (used only during email verification)
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
