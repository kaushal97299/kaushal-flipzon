const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/ProductSchema");

// ✅ Razorpay instance with hardcoded keys
const razorpay = new Razorpay({
  key_id: "rzp_test_4xjKupfTBgr5M6",           // 🔐 Replace with your actual test/live Razorpay key
  key_secret: "wjnFIGAicMZbQ1e769l7Cubb",          // 🔐 Replace with your actual secret
});

// 📌 Create Razorpay Order
router.post("/create", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create Razorpay order", error });
  }
});

// 📌 Verify Razorpay Payment & Save Order
router.post("/", async (req, res) => {
  try {
    const {
      userId, // optional
      name,
      address,
      phone,
      product,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;
     console.log("Request Body:", req.body);
    // 🧠 Signature verification logic
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", "wjnFIGAicMZbQ1e769l7Cubb") // ✅ use direct key (since you're not using env)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment signature invalid" });
    }

    // ✅ Create and save order
    const newOrder = new Order({
      userId: userId || null, // Allow guest checkout
      name,
      address,
      phone,
      product,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderTime: new Date(),
    });
console.log("New Order:", newOrder);
    await newOrder.save();
    res.status(201).json({ message: "✅ Order placed successfully!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "❌ Order verification failed", error: error.message });
  }
});
// 📌 Get All Orders
router.get("/Orders", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

// 📌 Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }
    res.status(200).json({ message: "✅ Order deleted successfully", order });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete order", error: error.message });
  }
});

module.exports = router;
