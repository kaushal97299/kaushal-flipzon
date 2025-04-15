const express = require('express');
const app = express();
const Review = require('../models/Review');
const AddProducts=require('../models/ProductSchema');


// Create a new review
app.post('/rew',  async (req, res) => {
  const { userName,productId,userId,rating, text } = req.body;
  console.log(req.body);
  // Basic validation
  if ( !rating || !text) {
    return res.status(403).json({ message: 'Please provide productId, rating, and text' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(401).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      text
    });
    console.log("before save",newReview);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/rew/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const reviews = await Review.find({ productId }).populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete('/:id', async (req, res) => {
  const reviewId = req.params.id;
  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;