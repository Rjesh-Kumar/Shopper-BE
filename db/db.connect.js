const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ Error connecting Database:", error.message);
  }
};

module.exports = { initializeDatabase };
