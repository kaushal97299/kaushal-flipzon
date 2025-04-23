const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const Product = require("../models/ProductSchema");
const authMiddleware = require("../middleware/auth");

const app = express.Router();

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

// ✅ Add Product (with subcategory)
app.post("/add",  authMiddleware , upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const {
      pname,
      price,
      category,
      subcategory,
      description,
      brand,
      discount = 0,
      offerEndDate,
    } = req.body;

    if (
      !pname ||
      !price ||
      !category ||
      !subcategory ||
      !description ||
      !brand
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required including subcategory." });
    }

    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);
    const finalPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;

    const imageUrl = req.file.path;

    const newProduct = new Product({
      pname,
      price: parsedPrice,
      category,
      subcategory,
      description,
      brand,
      discount: parsedDiscount,
      offerEndDate,
      image: imageUrl,
      finalPrice,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Get All Products
app.get("/prod", authMiddleware ,  async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// ✅ Get Single Product by ID
app.get("/prod/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

// ✅ Delete Product
app.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // TODO: Optionally delete Cloudinary image via public_id
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
});

// ✅ Update Product (with subcategory)
app.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const parsedPrice = parseFloat(req.body.price || product.price);
    const parsedDiscount = parseFloat(req.body.discount || product.discount);
    updatedData.finalPrice =
      parsedPrice - (parsedPrice * parsedDiscount) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

module.exports = app;
