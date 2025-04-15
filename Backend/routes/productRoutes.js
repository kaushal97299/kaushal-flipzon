const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/ProductSchema");

const app = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Add Product (POST)
app.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const { pname, price, category, description, brand, discount = 0, offerEndDate } = req.body;

    // Input validation
    if (!pname || !price || !category || !description || !brand) {
      return res.status(400).json({ message: "All fields are required except image and discount." });
    }

    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);
    const finalPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;

    const newProduct = new Product({
      pname,
      price: parsedPrice,
      category,
      description,
      brand,
      discount: parsedDiscount,
      offerEndDate,
      image: req.file.filename, // Store the image filename
      finalPrice,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Get All Products (GET)
app.get("/prod", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// ✅ Get Single Product by ID (GET)
app.get("/prod/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// ✅ Delete Product by ID (DELETE)
app.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file
    if (product.image) {
      const imagePath = path.join(uploadDir, product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// ✅ Update Product by ID (PUT)
app.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updatedData = { ...req.body };

    // If image is uploaded, handle image update
    if (req.file) {
      const oldImagePath = path.join(uploadDir, product.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); // Delete the old image
      updatedData.image = req.file.filename; // Update to the new image filename
    }

    // Ensure final price updates
    const parsedPrice = parseFloat(req.body.price || product.price);
    const parsedDiscount = parseFloat(req.body.discount || product.discount);
    updatedData.finalPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

module.exports = app;
