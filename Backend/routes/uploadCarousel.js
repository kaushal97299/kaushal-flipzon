const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CarouselImage = require("../models/CarouselImage");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploadsCarou/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ POST: Upload images
app.post("/upload", upload.array("images", 3), async (req, res) => {
  try {
    const savedImages = await Promise.all(
      req.files.map(async (file) => {
        const newImage = new CarouselImage({
          imageUrl: `https://ecommerce-atbk.onrender.com/uploadsCarou/${file.filename}`,
        });
        return await newImage.save();
      })
    );
    const urls = savedImages.map((img) => img.imageUrl);
    res.json({ imageUrls: urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// ✅ GET: Fetch all carousel images
app.get("/images", async (req, res) => {
  try {
    const images = await CarouselImage.find().sort({ uploadedAt: -1 }).limit(3);
    const urls = images.map((img) => img.imageUrl);
    res.json(urls);
  } catch (err) {
    console.error("Get images error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = app;
