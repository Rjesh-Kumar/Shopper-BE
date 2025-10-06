const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");

const Product = require("./models/Product");
const Category = require("./models/Category");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const Address = require("./models/Address");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Initialize DB
initializeDatabase();

// --- Welcome ---
app.get("/", (req, res) => res.send("🛒 E-Commerce Backend Running"));

// --- Products ---
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ data: { products } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ data: { product } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products/create", async (req, res) => {
  try {
    const { name, categoryName, price, originalPrice, discount, rating, sizes, description, deliveryCharge, image } = req.body;
    const category = await Category.findOne({ name: categoryName });
    if (!category) return res.status(400).json({ error: "Invalid category name" });

    const newProduct = await Product.create({
      name, category: category._id, price, originalPrice, discount, rating, sizes, description, deliveryCharge, image
    });
    res.status(201).json({ data: { product: newProduct } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Categories ---
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ data: { categories } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ data: { category } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new category
app.post("/api/categories/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ error: "Category already exists" });

    const category = await Category.create({
      name,
      description: description || [],
    });

    res.status(201).json({ data: { category } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Wishlist ---
app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate("products");
    res.json({ data: { wishlist } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishlist/:userId/add", async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.params.userId },
      { $addToSet: { products: productId } }, // prevent duplicates
      { upsert: true, new: true }
    ).populate("products");
    res.json({ data: { wishlist } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wishlist/:userId/remove", async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products");
    res.json({ data: { wishlist } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Cart ---
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
    res.json({ data: { cart } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cart/:userId/add", async (req, res) => {
  try {
    const { productId, quantity = 1, size = null } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = await Cart.create({
        userId: req.params.userId,
        products: [{ productId, quantity, size }]
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index >= 0) {
        if (quantity !== 0) {
          cart.products[index].quantity += quantity; // only update quantity if not 0
        }
        if (size) {
          cart.products[index].size = size; // update size
        }
      } else {
        cart.products.push({ productId, quantity, size });
      }

      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate("products.productId");
    res.json({ data: { cart } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.post("/api/cart/:userId/remove", async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { products: { productId } } },
      { new: true }
    ).populate("products.productId");
    res.json({ data: { cart } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Address ---
app.get("/api/address/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json({ data: { addresses } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/address/:userId/add", async (req, res) => {
  try {
    const address = await Address.create({ userId: req.params.userId, ...req.body });
    res.json({ data: { address } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/address/:addressId", async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.addressId,
      req.body,
      { new: true }
    );
    res.json({ data: { address: updated } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/api/address/:addressId", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.addressId);
    res.json({ message: "Address removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Orders ---
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .populate("addressId");
    res.json({ data: { orders } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders/:userId/create", async (req, res) => {
  try {
    const order = await Order.create({ userId: req.params.userId, ...req.body });
    res.json({ data: { order } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Start Server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
