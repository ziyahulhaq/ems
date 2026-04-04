const mongoose = require("mongoose");
const Department = require("../models/Department");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isValidDepartmentId = (id) => mongoose.Types.ObjectId.isValid(id);

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ dep_name: 1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Get department server error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const trimmedName = dep_name?.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({
      dep_name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" },
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        error: "Department already exists",
      });
    }

    const newDep = new Department({
      dep_name: trimmedName,
      description: description?.trim() || "",
    });

    await newDep.save();
    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    console.error("Add Department Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Department already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Add Department Server Error",
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidDepartmentId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid department id",
      });
    }

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Get department server error",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const trimmedName = dep_name?.trim();

    if (!isValidDepartmentId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid department id",
      });
    }

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const existingDepartment = await Department.findOne({
      dep_name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" },
      _id: { $ne: id },
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        error: "Department already exists",
      });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      {
        dep_name: trimmedName,
        description: description?.trim() || "",
      },
      { new: true, runValidators: true },
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Update Department Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Department already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Update Department Server Error",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidDepartmentId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid department id",
      });
    }

    const deletedep = await Department.findByIdAndDelete(id);

    if (!deletedep) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedep,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Delete department server error",
    });
  }
};

module.exports = {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
