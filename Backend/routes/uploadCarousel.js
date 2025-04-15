const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CarouselImage = require("../models/CarouselImage");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "../uploadsCarou";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("images", 3);

app.post("/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Multer error occurred" });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ error: "Unknown error occurred" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      const savedImages = await Promise.all(
        req.files.map(async (file) => {
          const newImage = new CarouselImage({
            imageUrl: `https://kaushal-flipzon.onrender.com/uploadsCarou/${file.filename}`,
          });
          return await newImage.save();
        })
      );
      const urls = savedImages.map((img) => img.imageUrl);
      res.json({ imageUrls: urls });
    } catch (err) {
      console.error("DB Save error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  });
});

module.exports = app;
