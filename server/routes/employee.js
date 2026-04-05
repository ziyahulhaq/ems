const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const authorizeRoles = require("../middleware/authorizeRoles.js");
const {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} = require("../controllers/employeeController.js");

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.post("/add", authMiddleware, authorizeRoles("admin"), addEmployee);
router.patch("/:id", authMiddleware, authorizeRoles("admin"), updateEmployee);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteEmployee);

module.exports = router;
