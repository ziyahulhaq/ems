const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, error: "token not provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "token not provided" });
    }

    if (!process.env.JWT_KEY) {
      return res.status(500).json({ success: false, error: "JWT_KEY is not set" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(401).json({ success: false, error: "token not valid" });
    }
    const user = await User.findById({ _id: decoded._id }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "token not valid" });
    }

    return res.status(500).json({ success: false, error: "server side error" });
  }
};

module.exports = verifyUser
