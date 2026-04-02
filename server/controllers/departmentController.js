const Department = require("../models/Departmnet");

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
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

    if (!dep_name?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const newDep = new Department({
      dep_name: dep_name.trim(),
      description,
    });

    await newDep.save();
    return res.status(200).json({ success: true, department: newDep });
  } catch (error) {
    console.error("Add Department Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Add Department Server Error",
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (!dep_name?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      {
        dep_name: dep_name.trim(),
        description,
        updatedAt: new Date(),
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
    return res.status(500).json({
      success: false,
      error: error.message || "Update Department Server Error",
    });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

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
      error: "delete department server error",
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
