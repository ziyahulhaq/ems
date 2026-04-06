const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const authorizeRoles = require("../middleware/authorizeRoles.js");
const {
  getLeaves,
  createLeave,
  updateLeaveStatus,
} = require("../controllers/leaveController.js");

const router = express.Router();

router.get("/", authMiddleware, getLeaves);
router.post("/", authMiddleware, createLeave);
router.patch("/:id/status", authMiddleware, authorizeRoles("admin"), updateLeaveStatus);

module.exports = router;
