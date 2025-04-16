const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const CarouselImage = require("../models/CarouselImage");

const app = express();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: "djglqucwv",
  api_key: "188628164289596",
  api_secret: "fHowoGuNyUzyMzIgTRHPMjCatIY",
});

// ✅ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "carousel", // optional folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ✅ Upload endpoint
app.post("/upload", upload.array("images", 3), async (req, res) => {
  try {
    const urls = req.files.map((file) => file.path); // Cloudinary URL

    const savedImages = await Promise.all(
      urls.map((url) => {
        const newImage = new CarouselImage({ imageUrl: url });
        return newImage.save();
      })
    );

    res.json({ imageUrls: urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// ✅ Get all images
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
