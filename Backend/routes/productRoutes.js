const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const Product = require("../models/ProductSchema");
const clientOnly = require("../middleware/auth");

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
app.post("/add", clientOnly ,  upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const {
      userId ,
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
      !userId ||
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
      userId ,
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
      console.log(newProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Get All Products
app.get("/prod/:userId", clientOnly , async (req, res) => {
  try {
    const products = await Product.find({userId : req.params.userId});
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/add/:productId", async (req, res) => {
  try {
    const products = await Product.findById(req.params.productId);
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/prod",  async (req, res) => {
  console.log("Fetching all products...");
  try {
    const products = await Product.find({});
    res.json(products);
    console.log(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetchinggggg products", error: error.message });
      console.log(error.message);
  }
});


// ✅ Get Single Product by ID
app.get("/singleprod/:id", clientOnly , async (req, res) => {
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
app.delete("/:id", clientOnly , async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // TODO: Optionally delete Cloudinary image via public_id yoo
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
});

// ✅ Update Product (with subcategory)
app.put("/:id", clientOnly , upload.single("image"), async (req, res) => {
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
