const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    dep_name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  },
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
