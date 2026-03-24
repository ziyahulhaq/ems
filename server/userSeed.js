const mongoose = require("mongoose")
const User = require("./models/User.js")
const bcrypt = require("bcrypt")
const connectToDatabase = require("./db/db.js")

const userRegister = async () => {
  try {
    await connectToDatabase()
    const hashPassword = await bcrypt.hash("admin", 10)
    const adminUser = {
      name: "Admin",
      email: "neyma@gmail.com",
      password: hashPassword,
      role: "admin"
    }

    await User.findOneAndUpdate(
      { email: adminUser.email },
      adminUser,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    console.log("Admin user seeded")
  } catch (error) {
    console.error("User seed failed:", error.message)
  } finally {
    await mongoose.connection.close()
  }
}

userRegister()
