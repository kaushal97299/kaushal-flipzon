const mongoose = require("mongoose");

const categoryOptions = {
  Electronics: ["Laptops", "Cameras", "Televisions", "Accessories"],
  Fashion: ["Men", "Women", "Kids"],
  "Beauty & Personal Care": ["Makeup", "Skincare", "Hair Care"],
  "Home & Living": ["Furniture", "Decor", "Kitchen"],
  "Toys & Games": ["Action Figures", "Board Games"],
  "Sports & Outdoors": ["Fitness Equipment", "Outdoor Gear"],
  "Food & Beverages": ["Snacks", "Beverages"],
  "Books, Movies & Music": ["Books", "Movies", "Music"],
  "Health & Fitness": ["Supplements", "Yoga", "Medical Devices"],
  "Office Supplies": ["Stationery", "Printers", "Chairs"],
  Technology: ["Smart Home", "Wearables"],
  Mobile: ["Smartphones", "Tablets"],
  Earphones: ["Wired", "Wireless"],
};

const categories = Object.keys(categoryOptions).sort();

const productSchema = new mongoose.Schema(
  {
    userId : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    pname: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      required: true,
      enum: categories,
      trim: true,
    },

    subcategory: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return categoryOptions[this.category]?.includes(v);
        },
        message: "Subcategory must be valid for the selected category.",
      },
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
          return /\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: "Invalid image format! Only JPG, JPEG, PNG, and GIF are allowed.",
      },
    },

    finalPrice: { type: Number, min: 0 },
  },
  { timestamps: true }
);

// Auto-calculate finalPrice before saving
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  next();
});

// Auto-calculate finalPrice on updates
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.price !== undefined || update.discount !== undefined) {
    const price = update.price ?? this._update.price;
    const discount = update.discount ?? this._update.discount ?? 0;
    update.finalPrice = price - (price * discount) / 100;
  }

  next();
});

module.exports = mongoose.model("AddProducts", productSchema);
