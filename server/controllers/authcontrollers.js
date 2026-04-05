const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ success: false, error: "User password is not configured" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    if (!process.env.JWT_KEY) {
      return res
        .status(500)
        .json({ success: false, error: "JWT_KEY is not configured" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
    );
    res
      .status(200)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

module.exports = { login, verify };
