const mongoose = require("mongoose");

const createEmployeeCode = () =>
  `EMP-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      default: createEmployeeCode,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    designation: { type: String, trim: true, default: "" },
    department: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
      required: true,
      trim: true,
      lowercase: true,
    },
    salary: { type: Number, min: 0 },
    profileImage: { type: String, trim: true, default: "" },
    notes: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["active", "hold"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
