const mongoose = require("mongoose")

const connectToDatabase = async () => {
  const mongoUrl = process.env.MONGODB_URL

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not set")
  }

  try {
    await mongoose.connect(mongoUrl)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    throw error
  }
}

module.exports = connectToDatabase
