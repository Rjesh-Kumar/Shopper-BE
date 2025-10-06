const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      size: { type: String, default: null }
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
