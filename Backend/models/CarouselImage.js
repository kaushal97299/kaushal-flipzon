const mongoose = require("mongoose");

const carouselImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CarouselImage", carouselImageSchema);
