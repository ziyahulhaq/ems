const mongoose = require("mongoose");

const departmentScheme = new mongoose.Schema({
  dep_name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  createAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Department = mongoose.model("Department", departmentScheme);

module.exports = Department;
