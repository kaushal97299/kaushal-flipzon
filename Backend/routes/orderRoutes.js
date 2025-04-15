const express = require("express");
const app = express();
const ord = require("../models/Order");
const Product = require("../models/ProductSchema"); // Import the Product model 
// to get product details


// 📌 Place Order
app.post("/", async (req, res) => {
  try {
    const { name, address, phone, product } = req.body;

    // Fetch product details from the database by the product ID
    const productDetails = await Product.findById(product._id);
    console.log(productDetails);
    // Check if the product exists in the database
    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate final price after discount
    // const finalPrice = productDetails.price - (productDetails.price * (productDetails.discount || 0)) / 100;

    // Create a new order with the product ID and final price
    const newOrder = new ord({
      name,
      address,
      phone,
      product: productDetails, // Store only the product ID
      // finalPrice,
      orderTime: new Date(),
    });

    console.log(newOrder);

    // Save the new order to the database
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order", error });
  }
});

// 📌 Get All Orders
app.get("/Orders", async (req, res) => {
  try {
    const orders = await ord.find({}).populate("product"); // Populate the product reference
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

// 📌 Delete Order
app.delete("/:id", async (req, res) => {
  try {
    const order = await ord.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }
    res.status(200).json({ message: "✅ Order deleted successfully", order });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete order", error: error.message });
  }
});

module.exports = app;
