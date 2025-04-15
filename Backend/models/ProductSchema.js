const mongoose = require("mongoose");
// const Review = require("./Review"); // Import the Review model

const categories = [
  "Electronics",
  "Fashion",
  "Beauty & Personal Care",
  "Home & Living",
  "Toys & Games",
  "Sports & Outdoors",
  "Food & Beverages",
  "Books, Movies & Music",
  "Health & Fitness",
  "Office Supplies",
  "Technology",
  "Mobile",        // Add "Mobile" category
  "Earphones",     // Add "Earphones" category
];

const productSchema = new mongoose.Schema(
  {
    pname: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: categories, // ✅ Enforce only allowed categories, including Mobile and Earphones
    },
    description: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    offerEndDate: { type: Date },
    image: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/i.test(v); // ✅ Validates image URLs
        },
        message: "Invalid image format! Only JPG, JPEG, PNG, and GIF are allowed.",
      },
    },
    finalPrice: { type: Number, min: 0 },
  },
  { timestamps: true }

  
);

// ✅ Calculate finalPrice before saving
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  next();
});

// ✅ Update finalPrice on update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price !== undefined || update.discount !== undefined) {
    update.finalPrice = update.price - (update.price * (update.discount || 0)) / 100;
  }
  next();
});

module.exports = mongoose.model("AddProducts", productSchema);
