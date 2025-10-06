const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  discount: { type: String, default: "0%" },
  rating: { type: Number, default: 0 },
  sizes: { type: [String], default: [] },
  description: { type: [String], default: [] },
  deliveryCharge: { type: Number, default: 0 },
  image: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
