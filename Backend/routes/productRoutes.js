const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // your Cloudinary config
const Product = require("../models/ProductSchema");

const app = express.Router();

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "productImages", // Save in this folder on Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

// ✅ Add Product (POST)
app.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const { pname, price, category, description, brand, discount = 0, offerEndDate } = req.body;

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
      image: req.file.path, // ✅ Cloudinary full URL
      finalPrice,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Get All Products
app.get("/prod", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// ✅ Get Single Product by ID
app.get("/prod/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// ✅ Delete Product
app.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: delete Cloudinary image (requires public_id logic)
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// ✅ Update Product
app.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path; // update Cloudinary URL
    }

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
