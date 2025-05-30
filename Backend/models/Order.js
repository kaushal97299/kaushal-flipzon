const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, "Name should only contain letters and spaces"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  address: {
    type: String,
    required: true,
    match: [/^[A-Za-z0-9\s,.-]+$/, "Address can contain letters, numbers, commas, and dots"],
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [100, "Address cannot exceed 100 characters"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
  },
  product: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    pname: { type: String },
    image: { type: String },
    // price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
  },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  razorpaySignature: { type: String },
  orderTime: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
