const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CarouselImage = require("../models/CarouselImage");

const app = express();

// ✅ Create uploadsCarou folder if it does not exist
const dir = path.join(__dirname, "../uploadsCarou");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log("✅ uploadsCarou folder created at:", dir);
} else {
  console.log("✅ uploadsCarou folder already exists:", dir);
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const savedImages = await Promise.all(
      req.files.map(async (file) => {
        const imageUrl = `https://kaushal-flipzon.onrender.com/uploadsCarou/${file.filename}`;
        const newImage = new CarouselImage({ imageUrl });
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

// ✅ GET: Fetch latest 3 images
app.get("/images", async (req, res) => {
  try {
    const images = await CarouselImage.find()
      .sort({ uploadedAt: -1 })
      .limit(3);
    const urls = images.map((img) => img.imageUrl);
    res.json(urls);
  } catch (err) {
    console.error("Get images error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = app;
